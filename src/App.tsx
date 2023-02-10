import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  BACKEND_URL,
  ENTRY_BATCH_SIZE,
  ILCELER,
  ILLER,
  IL_EXCEPTIONS,
} from "./constants";

import { Entry, UserLocation } from "./model";
import PhoneActions from "./PhoneActions";
import { filterEntries, findPhoneNumbers, isPhoneNumber } from "./utils";

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [entryViewLength, setEntryViewLength] = useState(ENTRY_BATCH_SIZE);
  const description = useRef<HTMLTextAreaElement | null>(null);
  const [selectedCity, setSelectedCity] = useState("Hatay");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Merkez");
  const number = useRef<HTMLInputElement | null>(null);
  const [filter, setFilter] = useState({ city: "", district: "", search: "" });
  const [cityEntryCountMap, setCityEntryCountMap] =
    useState<Map<String, Number>>();

  async function useLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Tarayıcınız konum bilgisini desteklemiyor");
    }
  }

  async function success(position: GeolocationPosition) {
    const { latitude, longitude } = position.coords;
    const URL = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    const response = await fetch(URL);
    const data = await response.json();
    const { address } = data as { address: UserLocation };
    if (Object.keys(IL_EXCEPTIONS).includes(address.province)) {
      address.province = (IL_EXCEPTIONS as any)[address.province];
    }
    setSelectedCity(address.province);
    if (address.town === undefined) {
      setSelectedDistrict("Merkez");
    } else {
      setSelectedDistrict(address.town);
    }
  }

  async function error() {
    alert("Konum bilgisi alınamadı. Konum izinlerinizi kontrol edin.");
  }

  async function submitData() {
    if (!description.current?.value) return alert("Lütfen bir mesaj giriniz");

    if (!selectedCity) return alert("Lütfen bir şehir seçiniz");

    if (!selectedDistrict) return alert("Lütfen bir ilçe seçiniz");

    var data = {
      description: description.current?.value,
      city: selectedCity,
      district: selectedDistrict,
      number: number.current?.value,
    } as Entry;

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      description.current!.value = "";
      number.current!.value = "";
      setSelectedCity("Hatay");
      setSelectedDistrict("Antakya");
      data.createdAt = new Date().toISOString();
      data.numbersInDesc = findPhoneNumbers(data).numbersInDesc;
      setEntries([data, ...entries]);
      alert("Talebiniz başarıyla gönderildi!");
    }
    else if (response.status === 409) {
      alert("Bu talep daha önce gönderilmiş!");
    }
    else {
      alert("Talebiniz gönderilirken bir hata oluştu!");
    }
  }

  const countAndSetEntryCountsForCities = (entries: Entry[]) => {
    const countMap = new Map();
    ILLER.forEach((il) => countMap.set(il.text, 0));
    entries.forEach((entry) => {
      const city = entry.city;
      if (countMap.get(city) === undefined) {
        countMap.set(city, 0);
      } else {
        countMap.set(city, countMap.get(city) + 1);
      }
    });
    ILLER.sort((il1, il2) =>
      countMap.get(il1.text) > countMap.get(il2.text) ? -1 : 1
    );
    setCityEntryCountMap(countMap);
  };

  const updateEntryListLength = () => {
    setEntryViewLength(entryViewLength + ENTRY_BATCH_SIZE);
  };

  // get entries from backend
  useEffect(() => {
    fetch(BACKEND_URL)
      .then((response) => response.json())
      .then((data) => data = data.map(findPhoneNumbers))
      .then((data) => {
        data.sort((a: Entry, b: Entry) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setEntries(data);
        countAndSetEntryCountsForCities(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-secondary-black font-roboto">
      <header className="text-center text-slate-200 text-5xl mt-4">
        DEPREM YARDIM
      </header>
      <p className="text-slate-200 text-center text-base">
        <a
          href="https://github.com/cihatislamdede/deprem-yardim"
          target="_blank"
          rel="noreferrer"
          className="text-slate-400 text-center text-xs hover:text-slate-500 transition underline"
        >
          Bu Proje Açık Kaynaktır
        </a>
      </p>
      <div className="flex flex-col items-center mt-2">
        <p className="text-slate-400 text-center my-2 text-base">
          Deprem ile ilgili yardım taleplerinizi gönderebilirsiniz.
        </p>
        <textarea
          className="w-64 h-24 rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
          placeholder="Mesajınız*"
          ref={description}
          maxLength={280}
          rows={4}
        />
        <button
          onClick={useLocation}
          className="w-40 h-10 font-semibold rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black mt-4  placeholder:text-center placeholder:text-slate-200 hover:scale-95 transition"
        >
          Konumumu kullan
        </button>
        <span className="flex-shrink mx-4 text-gray-400 py-1">ya da</span>
        <div className="flex flex-col md:flex-row items-center gap-x-2">
          <div className="flex flex-col">
            <label
              htmlFor="cities"
              className="text-slate-200 text-center text-base"
            >
              İl*
            </label>
            <select
              id="cities"
              className=" w-48 h-10 rounded-md border-2 text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedDistrict("Merkez");
              }}
            >
              {ILLER.map((il) => (
                <option key={il.key} value={il.text}>
                  {il.text}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="districts"
              className="text-slate-200 text-center text-base"
            >
              İlçe*
            </label>
            <select
              id="districts"
              className=" w-48 h-10 rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="Merkez">Merkez</option>
              {ILCELER.filter((ilce) => ilce.il === selectedCity).map(
                (ilce) => (
                  <option key={ilce.ilce} value={ilce.ilce}>
                    {ilce.ilce}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
        <label
          htmlFor="number"
          className="text-slate-200 text-center mt-2 md:mt-4 text-base"
        >
          İletişim
        </label>
        <input
          id="number"
          placeholder="53..."
          className="w-48 h-10 rounded-md border-2 text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
          type="text"
          ref={number}
        />
        <button
          className="w-40 h-10 font-bold rounded-md text-center text-primary-black bg-primary-green mt-4  placeholder:text-center placeholder:text-slate-200 hover:scale-95 transition"
          onClick={submitData}
        >
          Gönder
        </button>
      </div>
      <div className="text-slate-200 text-base flex flex-row gap-x-6 justify-center mt-4">
        <a
          href="https://www.turkiye.gov.tr/afet-ve-acil-durum-yonetimi-acil-toplanma-alani-sorgulama"
          target="_blank"
          rel="noreferrer"
          className="text-slate-200 text-center text-sm md:text-base hover:text-slate-500 transition underline"
        >
          Toplanma Alanları
        </a>
        <a
          href="https://deprem.io"
          target="_blank"
          rel="noreferrer"
          className="text-slate-200 text-center text-sm md:text-base hover:text-slate-500 transition underline"
        >
          deprem.io
        </a>
        <a
          href="https://afetharita.com"
          target="_blank"
          rel="noreferrer"
          className="text-slate-200 text-center text-sm md:text-base hover:text-slate-500 transition underline"
        >
          Afet Harita
        </a>
      </div>
      <p className="text-center text-slate-500/50 text-sm mt-1 px-2">
        Gönderilen yardım taleplerinin doğruluğundan sorumlu değiliz.Lütfen
        sadece <span className="font-bold text-slate-500/60">doğruluğuna</span>{" "}
        emin olduğunuz yardım taleplerini gönderiniz.
        <br />
        Deprem Yardım kişisel verileri depolamaz, yardım edecek ve yardım
        bekleyen kişiler arasında köprü olmayı amaçlar.
      </p>
      <hr className="h-px my-4 border-0 bg-gray-700" />
      <p className="text-slate-200 font-semibold text-center text-2xl">
        Gönderilen Yardım Talepleri
      </p>
      {entries.length !== 0 && (
        <p className="text-center text-sm text-slate-500 italic">
          {entries.length} yardım talebi
        </p>
      )}
      <div className="flex flex-col items-center">
        <div className="flex flex-col">
          <label
            htmlFor="search"
            className="text-slate-200 text-center mt-2 text-base"
          >
            Ara
          </label>
          <input
            className="w-48 h-10 rounded-md border-2 ml-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
            value={filter.search}
            placeholder="İsim, telefon, il, ilçe..."
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            type="text"
          />
        </div>

        <div className="flex flex-row items-center md:gap-x-2">
          <div className="flex flex-col">
            <label
              htmlFor="cities"
              className="text-slate-200 text-center mt-2 text-base"
            >
              İl
            </label>
            <select
              id="cities"
              className=" w-32 mr-2 h-10 rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
              value={filter.city}
              onChange={(e) => setFilter({ ...filter, city: e.target.value })}
            >
              <option value="">Tümü</option>
              {ILLER.map((il) => (
                <>
                  {cityEntryCountMap?.get(il.text) !== 0 && (
                    <option key={il.key} value={il.text}>
                      {il.text + " (" + cityEntryCountMap?.get(il.text) + ")"}
                    </option>
                  )}
                </>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="districts"
              className="text-slate-200 text-center mt-2 text-base"
            >
              İlçe
            </label>
            <select
              id="districts"
              className=" w-32 h-10 rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
              value={filter.district}
              onChange={(e) =>
                setFilter({ ...filter, district: e.target.value })
              }
            >
              <option value="">Tümü</option>
              {ILCELER.filter((ilce) => ilce.il === filter.city).map((ilce) => (
                <option key={ilce.ilce} value={ilce.ilce}>
                  {ilce.ilce}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {entries.length === 0 ? (
        LoadingComponent()
      ) : (
        <InfiniteScroll
          loader={null}
          dataLength={entryViewLength}
          next={updateEntryListLength}
          hasMore={entryViewLength < entries.length}
          className="grid gap-2 row-gap-5 px-6 md:px-8 py-6 lg:grid-cols-5 sm:row-gap-6 sm:grid-cols-3"
        >
          {entries.length > 0 &&
            entries
              .slice(0, entryViewLength)
              .filter((e) => filterEntries(filter, e))
              .map((entry) => (
                <div
                  className="relative overflow-hidden transition duration-200 transform rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-2x"
                  key={entry.id}
                >
                  <div className="relative px-4 py-4 bg-black hover:bg-gray-900 transition-all">
                    <p className="text-sm font-medium text-white">
                      {entry.description}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-300">
                      {entry.city} / {entry.district}
                    </p>
                    {(entry.numbersInDesc.length === 0 && entry.number && isPhoneNumber(entry.number)) &&
                      <PhoneActions key={entry.number} number={entry.number}></PhoneActions>}
                    {entry.numbersInDesc.map((number, index) => <PhoneActions key={index} number={number}></PhoneActions>)}
                    <p className="mt-2 text-sm font-bold text-slate-400">
                      {new Date(entry.createdAt).toLocaleString("tr-TR", {
                        timeZone: "Europe/Istanbul",
                        hour: "numeric",
                        minute: "numeric",
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
        </InfiniteScroll>
      )}
    </div>
  );

  function LoadingComponent() {
    return (
      <div className="max-w-md space-y-2 mx-auto py-8 list-inside text-gray-400">
        <li className="flex items-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-5 h-5 mr-2 animate-spin text-gray-600 fill-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          Yardım talepleri yükleniyor...
        </li>
      </div>
    );
  }
}

export default App;

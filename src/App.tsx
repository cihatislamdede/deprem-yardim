import { useEffect, useState } from "react";
import { ILCELER, ILLER } from "./constants";

type Entry = {
  id: number | string;
  description: string;
  city: string;
  district: string;
  number?: string;
  createdAt: string;
};

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [description, setDescription] = useState("");
  const [selectedCity, setSelectedCity] = useState("Adana");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Saimbeyli");
  const [filter, setFilter] = useState({ city: "", district: "" });
  const [number, setNumber] = useState("");

  async function submitData() {
    const data = {
      description,
      city: selectedCity,
      district: selectedDistrict,
      number,
    } as Entry;
    if (data.city && data.district && data.description) {
      const URL = "https://deprem.noonlordhost.com/";
      const response = await fetch(URL, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setDescription("");
        setNumber("");
        data.createdAt = new Date().toISOString();
        setEntries([...entries, data]);
        alert("Mesajınız başarıyla gönderildi!");
      } else {
        alert("Bir hata oluştu!");
      }
    } else {
      alert("Lütfen tüm alanları doldurunuz");
    }
  }

  // get entries from backend
  useEffect(() => {
    const URL = "https://deprem.noonlordhost.com/";
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        data.sort((a: Entry, b: Entry) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setEntries(data);
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={280}
          rows={4}
        />
        <label
          htmlFor="cities"
          className="text-slate-200 text-center mt-2 text-base"
        >
          İl*
        </label>
        <select
          id="countries"
          className=" w-64 h-10 rounded-md border-2 text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {ILLER.map((il) => (
            <option key={il.key} value={il.text}>
              {il.text}
            </option>
          ))}
        </select>
        <label
          htmlFor="districts"
          className="text-slate-200 text-center mt-2 text-base"
        >
          İlçe*
        </label>
        <select
          id="districts"
          className=" w-64 h-10 rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          <option value="">Merkez</option>
          {ILCELER.filter((ilce) => ilce.il == selectedCity).map((ilce) => (
            <option key={ilce.ilce_id} value={ilce.ilce}>
              {ilce.ilce}
            </option>
          ))}
        </select>
        <label
          htmlFor="number"
          className="text-slate-200 text-center mt-2 text-base"
        >
          İletişim
        </label>
        <input
          id="number"
          placeholder="53..."
          className="w-64 h-10 rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
          type="text"
          value={number}
          maxLength={11}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button
          className="w-40 h-10 font-bold rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black mt-4  placeholder:text-center placeholder:text-slate-200 hover:scale-95 transition"
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
          className="text-slate-200 text-center text-base hover:text-slate-500 transition underline"
        >
          Acil Durum
          <br />
          Toplanma Alanları
        </a>
        <a
          href="https://www.afad.gov.tr/depremkampanyasi2"
          target="_blank"
          rel="noreferrer"
          className="text-slate-200 text-center text-base hover:text-slate-500 transition underline"
        >
          AFAD Bağış
        </a>
      </div>
      <p className="text-center text-slate-500/50 text-sm mt-1">
        Gönderilen yardım taleplerinin doğruluğundan sorumlu değiliz.Lütfen sadece <span className="font-bold text-slate-500/60">doğruluğuna</span> emin olduğunuz yardım taleplerini gönderiniz. 
        <br />
        Deprem Yardım kişisel verileri depolamaz, yardım edecek ve yardım bekleyen kişiler arasında köprü olmayı amaçlar.
      </p>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <p className="text-slate-200 font-semibold text-center text-2xl">
        Gönderilen Yardım Talepleri
      </p>
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center">
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
                <option key={il.key} value={il.text}>
                  {il.text}
                </option>
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
              {ILCELER.filter((ilce) => ilce.il == filter.city).map((ilce) => (
                <option key={ilce.ilce_id} value={ilce.ilce}>
                  {ilce.ilce}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid gap-2 row-gap-5 px-16 py-6 lg:grid-cols-5 sm:row-gap-6 sm:grid-cols-3">
        {entries.length > 0 &&
          entries
            .filter((entry) => {
              if (filter.city === "" && filter.district === "") {
                return true;
              } else if (filter.city !== "" && filter.district === "") {
                return entry.city === filter.city;
              } else if (filter.city !== "" && filter.district !== "") {
                return (
                  entry.city === filter.city &&
                  entry.district === filter.district
                );
              }
            })
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
                  {entry.number && (
                    <p className="mt-2 text-sm font-bold text-slate-400">
                      Tel: {entry.number}
                    </p>
                  )}
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
      </div>
    </div>
  );
}

export default App;

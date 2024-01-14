# Deprem Yardım Projesi

Twitter, Instagram, WhatsApp ve çeşitli web sitelerinde paylaşılan yardım çağrılarının düzenli bir şekilde paylaşılabilmesi için bir platform.

> <h1>Bu proje arşivlenmiştir. Kaybedilen canlarımıza Allah'tan rahmet diliyoruz. Umarız hiçbir zaman ihtiyaç duymayız.</h1>

## Amaç

Bilgi teknolojilerini kullanarak ilgili kurum ve STK'lara yardımcı olmak ve afet zamanlarında açık bir veri platformu sağlamak.

## Kullanılan Teknolojiler

- [Tailwind CSS](https://tailwindcss.com/)
- TypeScript
- ReactJS

## Tasarım

- [Renk paleti](https://coolors.co/000000-111111-232323-343434-464646-575757-696969-7a7a7a)
- [Icon](https://icons8.com)

## Proje Yapısı

- fe-dev
  - Bu dosya içinde Docker ile kurulu bir geliştirme ortamı bulunmaktadır. Eğer Docker kullanıyorsanız `docker-compose up -d` ve sonrasında `docker container exec -it fe-dev zsh` diyerek bütün gereksinimlerin kurulu olduğu ortamda doğrudan kod yazmaya başlayabilirsiniz. **Docker zorunlu değildir.** Projeyi isterseniz kendi ortamınızda da çalıştırabilirsiniz.
- public
- src
  - Projenin kendisi bu dosya içinde yer almaktadır. Yapacağınız geliştirmeler çoğunlukla `App.tsx` dosyasında olacaktır.

## API

- Deprem yardımlarını görüntüleyebilirsiniz.

```http
GET https://api.depremyardim.org
```

- Deprem yardımlarını gönderebilirsiniz.

```http
POST https://api.depremyardim.org
```

## Katkı Sağlayanlar

<a href="https://github.com/cihatislamdede/deprem-yardim/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=cihatislamdede/deprem-yardim" />
</a>

## Teşekkür :heart:

Sunucu tarafı için ücretsiz kredi sağlayan <b>Microsoft Türkiye</b> ekibine çok teşekkür ederiz.

## Notlar

> Proje gönüllü çalışmalarla oluşturulmuştur. Gerçek kişi ya da kuruluşlarla bir bağlantısı bulunmamaktadır.

> Herhangi bir eksiklik bulursanız ve yapabileceğiniz bir şey varsa projeyi `Fork` edip `Merge Request` oluşturabilirsiniz. `Issue` açarak sorunlarınızı bildirebilirsiniz.

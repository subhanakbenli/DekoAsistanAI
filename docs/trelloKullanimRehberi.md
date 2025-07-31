# **Trello ile Proje Takibi: Deko Asistan İçin Adım Adım Kanban Rehberi**

Merhaba\! Hackathon gibi yoğun ve zaman kısıtlı bir süreçte organize olmak, projenin başarısı için en az kodlama kadar kritiktir. Trello, bu organizasyonu sağlamak için mükemmel, görsel ve basit bir araçtır. İşte sizin "Deko Asistan" projeniz için Trello'da bir Kanban tahtası oluşturup bunu nasıl verimli kullanacağınıza dair detaylı rehberiniz.

### **Adım 1: Trello Hesabı ve Proje Panosu (Board) Oluşturma**

Her şeyden önce bir başlangıç noktasına ihtiyacımız var.

1. **Hesap Oluşturun:** Eğer yoksa, [trello.com](https://trello.com) adresinden ücretsiz bir hesap oluşturun.  
2. **Yeni Pano Oluşturun:** Giriş yaptıktan sonra, ana ekranınızda "Yeni pano oluştur" (Create new board) seçeneğini göreceksiniz. Tıklayın.  
3. **Panoyu Adlandırın:** Panonuza projenizi net bir şekilde yansıtan bir isim verin. Örneğin: **"Deko Asistan - Hackathon 2025"**. Arka plan rengini veya desenini takım ruhunuza uygun bir şekilde seçebilirsiniz\!

Artık projenizin dijital evine sahipsiniz.

### **Adım 2: Kanban Kolonlarını (Listeleri) Oluşturma**

Kanban'ın kalbi, iş akışını temsil eden kolonlardır. Trello'da bu kolonlara "Liste" (List) denir. Projeniz için ideal ve basit bir akış şu şekilde olacaktır:

1. **Yapılacaklar (To Do):** Bu kolon, geliştirme planınızdaki tüm görevlerin başlangıç noktasıdır. Henüz başlanmamış her iş burada yer alır.  
2. **Yapılıyor (In Progress):** Bir ekip üyesi bir göreve başladığında, o görevin kartını bu kolona taşır. Bu, "Şu an bunun üzerinde çalışıyorum" demektir ve aynı işe iki kişinin başlamasını engeller.  
3. **Test/Gözden Geçirme (Review):** Bir görev teknik olarak bittiğinde, bu kolona taşınır. Örneğin, Geliştirici 1 backend kodunu yazdıysa, Geliştirici 2'nin kısaca göz atması veya test etmesi için kartı buraya koyar. Bu, hataları erken yakalamak için kritik bir adımdır.  
4. **Bitti (Done):** Gözden geçirme de tamamlandıktan sonra, görev tamamen bitmiş demektir. Kart bu son kolona taşınır. Bu kolonun dolduğunu görmek size büyük bir motivasyon verecek\!

*Panonuzda varsayılan olarak gelen listeleri silebilir ve "Yeni liste ekle" (Add another list) diyerek bu dört kolonu oluşturabilirsiniz.*

\[Görsel: Deko Asistan için oluşturulmuş Trello panosu ve 4 temel Kanban kolonu\]

### **Adım 3: Geliştirme Planını Kartlara Dönüştürme**

Şimdi daha önce oluşturduğumuz 2 haftalık planı Trello'ya aktarma zamanı. Her bir görev, "Yapılacaklar" kolonunda bir "Kart" (Card) olacak.

1. "Yapılacaklar" kolonunun altındaki **"Kart ekle"** (Add a card) seçeneğine tıklayın.  
2. Geliştirme planınızdaki her bir maddeyi bir kart olarak ekleyin.

**Örnek Kartlar:**

* Backend: FastAPI projesini başlatma  
* Frontend: React (Vite) projesini başlatma  
* Ortak: products.json dosyasını oluşturma  
* Backend: /api/tasarim endpoint'ini oluşturma  
* Frontend: Temel UI bileşenlerini oluşturma  
* Backend: Function Calling için urun\_bul fonksiyonunu yazma  
* ...ve plandaki diğer tüm görevler.

### **Adım 4: Kartları Detaylandırma (Süper Güçler)**

Bir Trello kartı, sadece bir başlıktan çok daha fazlasıdır. Kartın üzerine tıkladığınızda açılan pencerede şu özellikleri kullanarak görevlerinizi netleştirin:

* **Üyeler (Members):** Kartı ilgili kişiye atayın. "Üyeler"e tıklayıp **Geliştirici 1** veya **Geliştirici 2**'yi seçin. Böylece kimin hangi görevden sorumlu olduğu netleşir.  
* **Etiketler (Labels):** Kartlarınızı görsel olarak kategorize edin. "Etiketler"e tıklayıp renkli etiketler oluşturun. Önerilen etiketler:  
  * Backend (Örn: Kırmızı)  
  * Frontend (Örn: Mavi)  
  * Bug (Hata) (Örn: Turuncu)  
  * Acil (Örn: Mor)  
* **Kontrol Listesi (Checklist):** Büyük bir görevi daha küçük adımlara bölmek için mükemmeldir. Örneğin, "Uçtan Uca Entegrasyon" kartı için bir kontrol listesi oluşturabilirsiniz:  
  * \[ \] Frontend form verisi backend'e ulaşıyor mu?  
  * \[ \] Gemini'dan gelen metin frontend'de görünüyor mu?  
  * \[ \] Imagen'den gelen resim frontend'de görünüyor mu?  
  * \[ \] Ürün linki doğru şekilde gösteriliyor mu?  
* **Açıklama (Description):** Görevle ilgili önemli notları, kod parçacıklarını veya linkleri buraya ekleyin.

\[Görsel: Detaylandırılmış bir Trello kartı. Üyeler, etiketler ve kontrol listesi atanmış.\]

### **Adım 5: Günlük Akış: Tahtayı Canlı Tutmak**

Artık sisteminiz hazır. Her gün bu tahtayı şu şekilde kullanacaksınız:

1. **Güne Başlarken (Daily Stand-up):** Günlük 5 dakikalık senkronizasyon toplantınızda Trello panosunu açın.  
2. **Görev Seçme:** Herkes o gün hangi görevi yapacağını "Yapılacaklar" kolonundan seçer ve kartı kendi üzerine atayıp **"Yapılıyor"** kolonuna sürükler.  
3. **İş Bitince:** Görevi tamamlayan kişi, kartı **"Test/Gözden Geçirme"** kolonuna taşır ve diğer ekip üyesine haber verir.  
4. **Onay ve Tamamlama:** Diğer üye kodu veya özelliği hızlıca kontrol eder. Her şey yolundaysa, kartı gururla **"Bitti"** kolonuna taşır\!

Bu döngü, projenizin nabzını tutmanızı, darboğazları görmenizi ve senkronize bir şekilde ilerlemenizi sağlar. Trello panonuz, projenizin yaşayan, nefes alan bir yansıması olacaktır.

Hackathon'da bol şans\! Bu düzenli çalışma şekliyle harika bir iş çıkaracağınıza eminim.
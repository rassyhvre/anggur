const mysql = require("mysql2/promise");
require("dotenv").config();

const seedData = async () => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    });

    console.log("🌱 Memulai seeding database...\n");

    try {
        // ===== 1. HAPUS DATA LAMA =====
        await pool.query("DELETE FROM penanganan");
        await pool.query("DELETE FROM penyakit");
        console.log("✅ Data lama dihapus.\n");

        // ===== 2. INSERT PENYAKIT =====
        const penyakitData = [
            {
                nama: "Black Rot",
                deskripsi: "Black Rot (Guignardia bidwellii) adalah salah satu penyakit paling merusak pada tanaman anggur yang disebabkan oleh jamur Guignardia bidwellii. Penyakit ini menyerang seluruh bagian tanaman termasuk daun, batang, sulur, dan buah. Gejala awal muncul berupa bercak-bercak kecil berwarna cokelat kemerahan pada permukaan daun yang secara bertahap membesar dan membentuk lesi nekrotik berwarna cokelat tua dengan tepi gelap yang khas. Pada buah, infeksi menyebabkan pembusukan total dimana buah berubah warna menjadi hitam, mengkerut, dan mengeras menjadi mumi (mumifikasi). Jamur ini bertahan hidup pada sisa-sisa tanaman yang terinfeksi selama musim dingin dan menyebar melalui percikan air hujan pada musim semi. Kondisi lingkungan yang hangat (21-27°C) dan lembap sangat mendukung perkembangan penyakit ini. Kerugian ekonomi akibat Black Rot bisa mencapai 80% dari total panen jika tidak ditangani dengan baik.",
                penyebab: "Penyakit Black Rot disebabkan oleh jamur patogen Guignardia bidwellii (anamorph: Phyllosticta ampelicida). Jamur ini bertahan hidup pada mumi buah, daun yang gugur, dan jaringan tanaman yang terinfeksi dari musim sebelumnya. Spora (askospora) dilepaskan saat kondisi basah dan hangat pada awal musim tanam, kemudian tersebar melalui percikan air hujan dan angin ke jaringan tanaman yang sehat. Faktor lingkungan yang memperparah meliputi curah hujan tinggi yang berkepanjangan, kelembapan udara di atas 90%, suhu antara 21-27°C, drainase tanah yang buruk, serta kanopi tanaman yang terlalu rapat sehingga menghambat sirkulasi udara. Tanaman anggur yang stres akibat kekurangan nutrisi atau serangan hama juga lebih rentan terhadap infeksi jamur ini."
            },
            {
                nama: "Black Measles",
                deskripsi: "Black Measles, atau dikenal juga sebagai Esca atau Grapevine Measles, adalah penyakit kompleks dan kronis pada tanaman anggur yang melibatkan beberapa species jamur patogen. Penyakit ini termasuk salah satu penyakit kayu (trunk disease) yang paling sulit dikelola pada kebun anggur di seluruh dunia. Gejala pada daun berupa bercak-bercak klorotik (menguning) antar tulang daun yang kemudian mengering dan berubah menjadi nekrotik berwarna cokelat kemerahan, membentuk pola khas menyerupai gejala campak (measles). Pada buah, muncul bintik-bintik kecil berwarna gelap (dark spots) di permukaan kulit yang mengurangi kualitas dan nilai jual. Pada kasus yang parah, tanaman bisa mengalami apoplexy yaitu kematian mendadak pada cabang atau seluruh pohon akibat penyumbatan pembuluh kayu oleh massa jamur. Penyakit ini berkembang secara perlahan selama bertahun-tahun dan seringkali baru terdeteksi ketika kerusakan internal sudah sangat parah. Black Measles menjadi ancaman serius terutama pada kebun anggur yang sudah berusia tua.",
                penyebab: "Black Measles disebabkan oleh kompleks jamur patogen yang meliputi Phaeomoniella chlamydospora, Phaeoacremonium minimum (sebelumnya P. aleophilum), dan beberapa spesies dari genus Botryosphaeria dan Fomitiporia. Jamur-jamur ini menginfeksi tanaman melalui luka pemangkasan, luka mekanis, atau celah alami pada batang dan cabang. Infeksi awal seringkali terjadi di persemaian atau saat penanaman bibit yang sudah terinfeksi secara laten. Faktor yang memperparah penyakit meliputi pemangkasan yang tidak tepat (terutama saat musim hujan), penggunaan alat pemangkas yang tidak disterilisasi, stres air berkepanjangan, umur tanaman yang sudah tua (>10 tahun), dan praktik budidaya yang buruk. Jamur tumbuh secara perlahan di dalam jaringan kayu batang utama, merusak pembuluh xylem dan phloem sehingga mengganggu distribusi air dan nutrisi ke seluruh bagian tanaman."
            },
            {
                nama: "Isariopsis Leaf Spot",
                deskripsi: "Isariopsis Leaf Spot, juga dikenal sebagai Leaf Blight atau Pseudocercospora vitis, adalah penyakit daun pada tanaman anggur yang disebabkan oleh jamur Pseudocercospora vitis (sinonim: Isariopsis clavispora). Penyakit ini tersebar luas di daerah tropis dan subtropis dengan iklim hangat dan lembap. Gejala awal berupa bercak-bercak kecil berbentuk tidak beraturan pada permukaan atas daun yang berwarna kuning kehijauan (klorotik), kemudian secara bertahap berubah menjadi cokelat kemerahan hingga cokelat gelap dengan halo kuning di sekelilingnya. Pada permukaan bawah daun, terdapat massa spora jamur berwarna gelap yang tampak seperti beledu atau tepung halus. Infeksi berat menyebabkan daun menguning secara menyeluruh, mengering, dan akhirnya gugur prematur (defoliasi dini). Defoliasi yang parah mengurangi kemampuan fotosintesis tanaman secara drastis, menurunkan kualitas buah, menghambat pematangan, dan melemahkan daya tahan tanaman terhadap stres lingkungan di musim berikutnya. Serangan berulang selama beberapa musim dapat melemahkan pertumbuhan vegetatif tanaman secara signifikan.",
                penyebab: "Penyakit Isariopsis Leaf Spot disebabkan oleh jamur Pseudocercospora vitis (sebelumnya dikenal sebagai Isariopsis clavispora atau Cercospora vitis). Jamur patogen ini menghasilkan konidiospora yang menyebar melalui angin dan percikan air hujan dari daun yang terinfeksi ke daun yang sehat. Spora berkecambah dan menginfeksi jaringan daun melalui stomata (mulut daun) pada permukaan bawah daun. Faktor lingkungan yang sangat mendukung perkembangan penyakit ini meliputi suhu hangat antara 25-30°C, kelembapan relatif tinggi di atas 80%, curah hujan yang sering dan berkepanjangan selama musim tanam, serta kondisi kanopi yang rapat dan kurang ventilasi. Penyakit ini terutama menyerang daun-daun yang sudah tua di bagian bawah kanopi dimana kondisi kelembapan lebih tinggi dan sirkulasi udara lebih buruk."
            },
            {
                nama: "Healthy",
                deskripsi: "Daun anggur yang sehat (Healthy) menunjukkan kondisi pertumbuhan yang optimal tanpa adanya tanda-tanda infeksi penyakit, serangan hama, maupun defisiensi nutrisi. Daun tampak segar dengan warna hijau cerah yang merata di seluruh permukaan, memiliki tekstur normal yang tidak layu atau keriting, serta menunjukkan pola pertumbuhan tulang daun yang simetris dan sempurna. Daun yang sehat merupakan indikator utama bahwa tanaman anggur menerima perawatan yang optimal meliputi penyiraman yang cukup dan teratur, pemupukan yang seimbang, paparan sinar matahari yang memadai (minimal 6-8 jam sehari), serta drainase tanah yang baik. Kondisi health check yang positif juga menandakan bahwa program pengendalian hama dan penyakit terpadu (IPM) yang diterapkan sudah berjalan efektif. Tanaman yang konsisten dalam kondisi sehat berpotensi menghasilkan buah anggur dengan kualitas premium baik dari segi rasa, ukuran, kandungan gula, maupun penampilan visual yang menarik untuk dipasarkan.",
                penyebab: "Daun anggur berada dalam kondisi sehat karena tanaman mendapatkan perawatan budidaya yang optimal dan konsisten. Faktor-faktor utama yang menjaga kesehatan tanaman meliputi: penyiraman teratur dengan volume yang tepat (tidak berlebihan maupun kekurangan), pemupukan seimbang yang mencakup unsur makro (Nitrogen, Fosfor, Kalium) dan mikro (Besi, Mangan, Seng, Boron), pH tanah yang optimal antara 5.5-7.0, drainase yang baik untuk mencegah genangan air, paparan cahaya matahari langsung minimal 6-8 jam per hari, pemangkasan rutin untuk menjaga sirkulasi udara pada kanopi, serta penerapan program perlindungan tanaman terpadu (IPM) yang meliputi monitoring berkala, sanitasi kebun, dan penggunaan pestisida secara bijaksana. Kebun anggur yang dikelola dengan standar GAP (Good Agricultural Practices) cenderung memiliki tingkat kesehatan tanaman yang tinggi dan konsisten."
            },
        ];

        const penyakitIds = {};
        for (const p of penyakitData) {
            const [result] = await pool.query(
                "INSERT INTO penyakit (nama_penyakit, deskripsi, penyebab) VALUES (?, ?, ?)",
                [p.nama, p.deskripsi, p.penyebab]
            );
            penyakitIds[p.nama] = result.insertId;
            console.log(`✅ Penyakit '${p.nama}' → id: ${result.insertId}`);
        }

        // ===== 3. INSERT PENANGANAN =====
        const penangananData = {
            "Black Rot": [
                {
                    judul: "Sanitasi Kebun & Pemusnahan Sumber Inokulum",
                    deskripsi: "Langkah pertama dan paling krusial dalam pengendalian Black Rot adalah melakukan sanitasi kebun secara menyeluruh dan konsisten. Kumpulkan dan musnahkan semua mumi buah (buah yang mengering dan menghitam) baik yang masih menempel di pohon maupun yang sudah jatuh ke tanah, karena mumi buah merupakan sumber utama spora jamur Guignardia bidwellii untuk infeksi di musim berikutnya. Potong dan bakar seluruh daun, ranting, dan sulur yang menunjukkan gejala infeksi berupa bercak cokelat nekrotik. Lakukan pembersihan ini secara rutin setiap minggu selama musim tanam aktif dan secara menyeluruh setelah panen selesai. Pastikan tidak ada sisa-sisa tanaman terinfeksi yang tertinggal di dalam kebun karena satu mumi buah saja sudah cukup untuk melepaskan ribuan spora yang mampu menginfeksi tanaman baru di musim depan. Gunakan mulsa plastik atau jerami bersih untuk menutup permukaan tanah di bawah kanopi guna mencegah percikan air hujan membawa spora dari tanah ke daun."
                },
                {
                    judul: "Aplikasi Fungisida Preventif Secara Terjadwal",
                    deskripsi: "Terapkan program penyemprotan fungisida preventif secara terjadwal dimulai sejak tunas baru mulai tumbuh (3-5 cm) dan dilanjutkan setiap 7-14 hari hingga buah memasuki fase veraison (perubahan warna). Gunakan fungisida berbahan aktif Mancozeb atau Captan sebagai perlindungan kontak pada tahap awal musim tanam, kemudian ganti ke fungisida sistemik seperti Myclobutanil, Thiophanate-methyl, atau Tebuconazole saat buah mulai terbentuk untuk perlindungan yang lebih mendalam ke dalam jaringan tanaman. Selalu rotasikan penggunaan fungisida dengan mode aksi yang berbeda (FRAC group berbeda) setiap 2-3 kali penyemprotan untuk mencegah resistensi jamur. Lakukan penyemprotan pada pagi hari saat angin tenang dan hindari penyemprotan saat hujan deras. Pastikan nozzle sprayer menghasilkan butiran halus yang merata menutupi seluruh permukaan daun, batang, dan buah. Catat setiap aplikasi (tanggal, jenis fungisida, konsentrasi) untuk evaluasi efektivitas di akhir musim."
                },
                {
                    judul: "Pengelolaan Kanopi & Perbaikan Drainase Kebun",
                    deskripsi: "Lakukan pemangkasan kanopi secara strategis untuk meningkatkan sirkulasi udara dan penetrasi sinar matahari ke seluruh bagian tanaman, karena kondisi lembap dan teduh sangat mendukung perkembangan jamur Black Rot. Pangkas cabang-cabang yang tumbuh terlalu rapat, buang tunas air (water sprout) yang tidak produktif, dan atur posisi sulur-sulur agar tidak saling bertumpukan. Idealnya, jarak antar cabang utama minimal 15-20 cm untuk memastikan aliran udara yang optimal. Perbaiki sistem drainase kebun dengan membuat parit-parit pembuangan air yang memadai, terutama pada lahan yang cenderung tergenang saat musim hujan. Pertimbangkan untuk menaikkan bedengan tanam 20-30 cm di atas permukaan tanah asli pada kebun baru. Atur jarak tanam yang cukup antar pohon (minimal 2-3 meter antar baris) dan pastikan orientasi baris tanaman searah dengan arah angin dominan untuk memaksimalkan pengeringan alami permukaan daun setelah hujan. Kurangi pemupukan nitrogen berlebihan yang mendorong pertumbuhan vegetatif rimbun dan rentan penyakit."
                },
            ],
            "Black Measles": [
                {
                    judul: "Pemangkasan Sanitasi & Perlindungan Luka Potong",
                    deskripsi: "Langkah paling penting dalam pengelolaan Black Measles adalah melakukan pemangkasan sanitasi yang tepat dan melindungi setiap luka potongan dari infeksi jamur. Lakukan pemangkasan hanya pada kondisi cuaca kering dan cerah, hindari memangkas saat hujan atau udara sangat lembap karena spora jamur Phaeomoniella dan Phaeoacremonium sangat aktif dalam kondisi basah. Sterilisasi alat pemangkas (gunting, gergaji) dengan larutan alkohol 70% atau sodium hipoklorit 2% sebelum berpindah dari satu pohon ke pohon lainnya untuk mencegah penularan silang. Segera setelah memotong cabang, oleskan pasta penutup luka (wound sealant) atau cat pelindung berbahan dasar akrilik yang dicampur fungisida (seperti Thiophanate-methyl) pada seluruh permukaan luka potong. Biarkan pasta mengering sempurna sebelum terkena air. Cabut dan bakar semua cabang dan batang yang menunjukkan gejala diskolorasi internal (warna cokelat kehitaman pada kayu saat dipotong melintang). Untuk tanaman yang sudah terinfeksi parah, lakukan pemangkasan retrotraitement yaitu memotong batang jauh di bawah area yang terinfeksi hingga tampak jaringan kayu yang bersih berwarna putih kekuningan."
                },
                {
                    judul: "Aplikasi Fungisida & Agen Hayati pada Jaringan Kayu",
                    deskripsi: "Terapkan kombinasi fungisida dan agen pengendali hayati untuk melindungi tanaman dari infeksi jamur penyebab Black Measles. Injeksikan larutan fungisida sistemik berbahan aktif Fosetil-Aluminium atau Propiconazole langsung ke dalam batang utama menggunakan metode trunk injection pada awal musim tanam untuk memberikan perlindungan internal. Semprotkan fungisida kontak berbasis tembaga (Copper Hydroxide atau Bordeaux mixture) pada seluruh permukaan batang dan cabang setelah pemangkasan musiman, fokuskan terutama pada area luka-luka potongan dan persimpangan cabang yang rentan terhadap infeksi. Kombinasikan dengan penggunaan agen hayati Trichoderma harzianum yang diaplikasikan sebagai pasta pada luka potong atau sebagai larutan yang disiramkan ke zona perakaran. Trichoderma berfungsi sebagai kolonisator kompetitif yang menghalangi pertumbuhan jamur patogen pada jaringan luka. Ulangi aplikasi agen hayati setiap 3-4 bulan terutama menjelang dan selama musim hujan. Lakukan monitoring rutin dengan memotong sampel cabang kecil secara acak dan memeriksa apakah ada diskolorasi internal sebagai tanda awal infeksi."
                },
                {
                    judul: "Pengelolaan Stres Tanaman & Revitalisasi Kebun",
                    deskripsi: "Tanaman anggur yang mengalami stres berkepanjangan jauh lebih rentan terhadap perkembangan gejala Black Measles, terutama apoplexy (kematian mendadak). Kelola stres tanaman dengan menerapkan program irigasi yang konsisten dan teratur, hindari fluktuasi ekstrem antara kekeringan dan kelebihan air yang dapat memicu manifestasi gejala secara tiba-tiba. Berikan pemupukan seimbang dengan mengurangi dosis nitrogen dan meningkatkan asupan kalium dan kalsium yang berperan memperkuat dinding sel dan meningkatkan ketahanan alami tanaman terhadap infeksi jamur. Aplikasikan kompos matang atau bahan organik berkualitas tinggi sebanyak 5-10 kg per pohon per tahun untuk memperbaiki struktur tanah dan meningkatkan populasi mikroorganisme tanah yang menguntungkan. Pertimbangkan program peremajaan kebun (replanting) secara bertahap untuk pohon-pohon yang sudah berusia sangat tua (>20 tahun) dan menunjukkan gejala Esca kronis yang parah, karena tanaman tua dengan banyak luka pemangkasan historis sangat sulit dipulihkan. Pada kebun baru, gunakan bibit bersertifikat bebas penyakit dari nursery terpercaya dan hindari penggunaan batang bawah dari tanaman induk yang terinfeksi."
                },
            ],
            "Isariopsis Leaf Spot": [
                {
                    judul: "Sanitasi Daun Terinfeksi & Pengelolaan Kanopi",
                    deskripsi: "Langkah utama dalam mengendalikan Isariopsis Leaf Spot adalah menghilangkan sumber inokulum (spora jamur) melalui sanitasi menyeluruh dan mengelola lingkungan mikro kanopi tanaman. Segera singkirkan semua daun yang menunjukkan gejala bercak kuning-cokelat dengan halo kuning, terutama daun-daun tua di bagian bawah kanopi yang biasanya terserang lebih dulu. Kumpulkan juga daun-daun yang sudah gugur di permukaan tanah karena spora jamur Pseudocercospora vitis dapat tetap hidup dan menjadi sumber infeksi baru. Musnahkan semua daun terinfeksi dengan cara dibakar atau dimasukkan ke dalam kantong plastik tertutup dan dibuang jauh dari area kebun, jangan dikomposkan karena spora kemungkinan masih dapat bertahan. Lakukan pemangkasan kanopi secara rutin setiap 2-3 minggu untuk membuka ruang sirkulasi udara di dalam tajuk tanaman, pangkas tunas-tunas lateral yang tumbuh terlalu rapat dan arahkan pertumbuhan cabang utama pada sistem teralis agar terpapar sinar matahari secara optimal. Kondisi kanopi yang terbuka dan kering akan secara signifikan mengurangi kelembapan mikro yang dibutuhkan jamur untuk berkecambah dan menginfeksi jaringan daun baru."
                },
                {
                    judul: "Program Penyemprotan Fungisida Terpadu",
                    deskripsi: "Implementasikan program penyemprotan fungisida secara preventif dan kuratif untuk mengendalikan perkembangan Isariopsis Leaf Spot sepanjang musim tanam. Mulai penyemprotan preventif menggunakan fungisida kontak berbasis sulfur (Wettable Sulphur) atau tembaga (Copper Oxychloride) dengan konsentrasi sesuai anjuran label pada saat daun-daun baru mulai berkembang penuh, ulangi setiap 10-14 hari terutama selama periode hujan. Untuk penyemprotan kuratif saat gejala sudah muncul, gunakan fungisida sistemik seperti Azoxystrobin, Difenoconazole, atau Carbendazim yang mampu menembus ke dalam jaringan daun dan menghentikan pertumbuhan miselium jamur. Rotasikan minimal 3 jenis fungisida dengan mode aksi berbeda sepanjang satu musim tanam untuk menghindari terjadinya resistensi jamur terhadap bahan aktif tertentu. Lakukan penyemprotan pada pagi hari (jam 06.00-09.00) atau sore hari (jam 16.00-18.00) saat suhu tidak terlalu panas dan tidak ada angin kencang agar larutan menempel sempurna pada permukaan daun. Tambahkan bahan perekat (sticker/spreader) ke dalam campuran semprot untuk meningkatkan daya rekat dan pemerataan larutan fungisida, terutama pada permukaan bawah daun dimana spora jamur paling banyak berkembang."
                },
                {
                    judul: "Optimalisasi Nutrisi & Ketahanan Alami Tanaman",
                    deskripsi: "Perkuat ketahanan alami tanaman anggur terhadap serangan Isariopsis Leaf Spot melalui program nutrisi yang optimal dan seimbang. Berikan pupuk yang mengandung kalium (K) dan kalsium (Ca) dalam jumlah cukup karena kedua unsur ini berperan vital dalam memperkuat dinding sel daun sehingga lebih tahan terhadap penetrasi hifa jamur. Aplikasikan pupuk kalium sulfat (K2SO4) dengan dosis 200-300 gram per pohon per aplikasi sebanyak 2-3 kali selama musim tanam. Hindari pemupukan nitrogen berlebihan karena pertumbuhan daun yang terlalu sukulen (lunak dan berair) justru lebih mudah terinfeksi oleh spora jamur. Tambahkan mikronutrien seperti Mangan (Mn) dan Seng (Zn) melalui penyemprotan daun (foliar spray) karena kedua unsur ini berperan sebagai ko-faktor enzim pertahanan tanaman. Pertimbangkan penggunaan biostimulan berbasis ekstrak rumput laut (Ascophyllum nodosum) atau asam humat yang telah terbukti meningkatkan produksi fitoaleksin dan enzim pertahanan alami tanaman. Jaga kelembapan tanah tetap konsisten melalui irigasi tetes (drip irrigation) dan hindari penyiraman dari atas (overhead sprinkler) yang menyebarkan spora jamur dan menciptakan kondisi basah pada permukaan daun yang menguntungkan perkembangan penyakit."
                },
            ],
            "Healthy": [
                {
                    judul: "Program Perawatan Rutin & Monitoring Kesehatan",
                    deskripsi: "Pertahankan kondisi sehat tanaman anggur dengan menerapkan program perawatan rutin yang komprehensif dan terjadwal. Lakukan inspeksi visual menyeluruh pada seluruh tanaman minimal sekali seminggu, periksa permukaan atas dan bawah daun, batang, sulur, dan buah untuk mendeteksi tanda-tanda awal infeksi penyakit, serangan hama, atau defisiensi nutrisi sebelum menjadi masalah serius. Dokumentasikan setiap temuan menggunakan fitur scan pada aplikasi rassyhvre untuk membangun catatan kesehatan tanaman yang sistematis dari waktu ke waktu. Terapkan jadwal penyiraman yang konsisten, idealnya menggunakan sistem irigasi tetes (drip irrigation) yang memberikan air langsung ke zona perakaran dengan volume 10-15 liter per pohon per hari pada musim panas dan 5-8 liter pada musim sejuk. Lakukan pemangkasan pembentukan (training pruning) secara teratur untuk menjaga arsitektur tanaman yang efisien, memastikan setiap cabang mendapatkan paparan sinar matahari yang memadai, dan mencegah pertumbuhan kanopi yang terlalu rapat. Bersihkan gulma di sekitar pangkal batang secara rutin dalam radius minimal 50 cm untuk mengurangi kompetisi nutrisi dan kelembapan berlebihan yang dapat memicu penyakit akar."
                },
                {
                    judul: "Pemupukan Seimbang & Pengelolaan Kesuburan Tanah",
                    deskripsi: "Jaga kesuburan tanah dan nutrisi tanaman dengan program pemupukan yang terencana berdasarkan hasil analisis tanah dan kebutuhan tanaman di setiap fase pertumbuhan. Lakukan uji tanah setiap 6 bulan untuk mengetahui status pH, kandungan unsur makro (N, P, K) dan mikro (Fe, Mn, Zn, B, Cu), serta kadar bahan organik tanah. Targetkan pH tanah optimal antara 5.5-7.0 dengan mengaplikasikan kapur dolomit jika terlalu asam atau sulfur jika terlalu basa. Terapkan jadwal pemupukan bertahap: berikan pupuk nitrogen tinggi (Urea atau ZA) pada awal musim tanam saat tunas mulai tumbuh, ganti ke pupuk berimbang NPK (15-15-15) saat fase pembungaan, dan tingkatkan porsi kalium (KCl atau K2SO4) saat buah mulai terbentuk dan memasuki fase pematangan. Tambahkan pupuk organik berkualitas berupa kompos matang atau pupuk kandang fermentasi sebanyak 10-15 kg per pohon per tahun yang diberikan pada awal musim tanam untuk memperbaiki struktur tanah, meningkatkan kapasitas menahan air, dan menyediakan nutrisi lepas lambat. Aplikasikan mikoriza pada saat penanaman atau setiap tahun untuk meningkatkan efisiensi penyerapan fosfor dan unsur hara lainnya oleh akar."
                },
                {
                    judul: "Pencegahan Penyakit & Pengendalian Hama Terpadu",
                    deskripsi: "Meskipun tanaman dalam kondisi sehat, program pencegahan penyakit dan pengendalian hama terpadu (Integrated Pest Management/IPM) harus tetap dijalankan secara konsisten untuk mempertahankan status kesehatan dan mencegah infeksi di masa mendatang. Terapkan penyemprotan fungisida preventif berbasis tembaga atau sulfur secara berkala setiap 14-21 hari selama musim hujan sebagai tindakan pencegahan terhadap jamur patogen. Gunakan perangkap serangga (sticky trap berwarna kuning) yang dipasang setiap 10-15 meter di sepanjang baris tanaman untuk memantau populasi hama seperti kutu kebul, thrips, dan lalat buah. Terapkan pengendalian hayati dengan melepas predator alami seperti Trichogramma untuk pengendalian ulat penggerek buah dan Phytoseiulus persimilis untuk pengendalian tungau laba-laba. Jaga kebersihan kebun dengan rutin membersihkan daun-daun yang gugur, membuang buah busuk, dan memangkas cabang mati yang bisa menjadi tempat berlindung hama dan patogen. Pasang penghalang fisik berupa jaring anti-serangga (insect net) di sekeliling kebun jika tekanan hama tinggi. Catat semua aplikasi pestisida, hasil monitoring, dan kondisi cuaca dalam buku log kebun untuk membangun basis data pengelolaan kebun yang efektif dan berkelanjutan."
                },
            ],
        };

        for (const [namaPenyakit, langkahList] of Object.entries(penangananData)) {
            const idPenyakit = penyakitIds[namaPenyakit];
            if (!idPenyakit) {
                console.log(`⚠️  Penyakit '${namaPenyakit}' tidak ditemukan, skip.`);
                continue;
            }
            for (const langkah of langkahList) {
                await pool.query(
                    "INSERT INTO penanganan (id_penyakit, judul_penanganan, deskripsi_penanganan) VALUES (?, ?, ?)",
                    [idPenyakit, langkah.judul, langkah.deskripsi]
                );
                console.log(`   📌 Penanganan '${langkah.judul}' → penyakit id: ${idPenyakit}`);
            }
        }

        console.log("\n🎉 Seeding selesai! Semua data penyakit dan penanganan berhasil dimasukkan ke database MySQL.");
    } catch (error) {
        console.error("❌ Error saat seeding:", error.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
};

seedData();

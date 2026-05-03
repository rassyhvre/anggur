const app = require("./app");
require("dotenv").config();
const os = require("os");

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`\n✅ Server berjalan di http://${HOST}:${PORT}`);
  console.log(`   Lokal: http://localhost:${PORT}`);

  // Tampilkan IP yang bisa diakses mobile
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        console.log(`   Network (${name}): http://${net.address}:${PORT}`);
      }
    }
  }
  console.log("");
});
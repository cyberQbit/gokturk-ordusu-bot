// Gerekli araçları discord.js kütüphanesinden çekiyoruz
const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

// Botun kimlik ve yetki ayarları
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

// Özel cevaplar listesi
const responses = {
    "sa": "Aleykümselam Efendi!",
    "selamün aleyküm": "Aleykümselam Efendi!",
    "nasılsın": "İyiyim Efendi, sizleri sormalı?",
};

client.commands = new Collection();

// 'commands' klasörü varsa içindeki komut dosyalarını yükle
if (fs.existsSync('./commands')) {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
}

// Bot açıldığında yapılacak işlemler
client.once('ready', () => {
    console.log(`✅ Giriş yapıldı: ${client.user.tag}`);

    // Botun durumu (Online ve Dinliyor)
    client.user.setPresence({
        activities: [{ 
            name: 'Göktürk Ordusu\'nu', 
            type: ActivityType.Watching 
        }],
        status: 'online',
    });

    console.log(`🚀 Durum ayarlandı ve bot hazır!`);
});

// Mesaj geldiğinde yapılacak işlemler
client.on('messageCreate', async message => {
    // Bot kendi mesajına veya başka botlara cevap vermesin
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();

    // 1. ÖZEL CEVAPLAR (Embed kutusu içinde)
    if (responses[msg]) {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF) // Mavi renk kodu
            .setDescription(responses[msg]);
            
        return message.reply({ embeds: [embed] });
    }

    // 2. KOMUT SİSTEMİ (! ile başlayanlar)
    const prefix = '!';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (command) {
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('❌ Komut çalıştırılırken bir hata oluştu!');
        }
    }
});

// Botu başlat
client.login(process.env.TOKEN);
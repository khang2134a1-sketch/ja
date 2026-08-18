const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// THAY LINK DƯỚI BẰNG LINK RAW TỪ GITHUB CỦA BẠN
const GITHUB_TXT_URL = "https://raw.githubusercontent.com/MHLATP/vv/refs/heads/main/b";

async function fetchCanvaData() {
    try {
        const response = await axios.get(GITHUB_TXT_URL);
        const lines = response.data.trim().split(/\r?\n/);
        const data = {};
        lines.forEach(line => {
            if (line.includes(" - ")) {
                const [date, link] = line.split(" - ");
                data[date.trim()] = link.trim();
            }
        });
        return data;
    } catch { return {}; }
}

client.on('messageCreate', async message => {
    if (message.content === '!setcanva') {
        const embed = new EmbedBuilder()
            .setTitle("Free Canva Pro (Team)")
            .setDescription("Nhấn vào nút **🔗 Lấy Link** bên dưới để lấy link.")
            .addFields({ name: '\u200B', value: '• 🔄 Quét link tự động.\n• 📅 Quét 22 ngày gần nhất.' })
            .setImage("https://cdn.tgdd.vn/News/1558244/2-1280x720.jpg")
            .setColor(0xEB5757)
            .setFooter({ text: "by : MHL_ATP 6 SCAN" });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('get_link_btn').setLabel('Lấy Link').setStyle(ButtonStyle.Success).setEmoji('🔗')
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId === 'get_link_btn') {
        const data = await fetchCanvaData();
        const dates = Object.keys(data);
        if (dates.length === 0) return interaction.reply({ content: "❌ Không có dữ liệu!", ephemeral: true });

        const options = dates.slice(0, 25).map(date => 
            new StringSelectMenuOptionBuilder().setLabel(date).setValue(date).setEmoji('📅')
        );

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId('date_select').setPlaceholder('Chọn ngày...').addOptions(options)
        );
        await interaction.reply({ content: "📅 **Chọn ngày:**", components: [row], ephemeral: true });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'date_select') {
        const data = await fetchCanvaData();
        await interaction.reply({ content: `🔗 **Link:** ${data[interaction.values[0]]}`, ephemeral: true });
    }
});

client.login("MTUwMTIwMTc3OTIwMTgwNjM1Ng.GasNCz.FQl5H-jTv6gTFUhZflcMz7wUoqBX4gDHI3-NJE");

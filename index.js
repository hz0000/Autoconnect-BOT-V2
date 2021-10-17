const { Client, MessageEmbed, MessageButton, MessageActionRow, Intents } = require("discord.js");

const client = new Client({
    intents:
        [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES
        ],
});

const config = require('./config.json')
const colors = require('colors')
const axios = require('axios')



client.on(`ready`, () => {
    console.log(colors.cyan("[Info] ") + "Carregamento do bot iniciado.\n")
})

var data = {}

client.on("ready", async () => {
    
    var players = 0

    async function players_online() {
        await axios.get(`http://${config.ip}${config.porta}/players.json`).then(response => {
            data.players = response.data.length
        }).catch(err => data.players = -1)

    }
    
    async function autoconnect() {
        await client.channels.cache.get(config.Canal).bulkDelete(100).catch(() => console.error)

        if (data.players === -1) {
            var embed = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(config.Logo)
                .setDescription(`Utilize os links para acessar nosso servidor.`)
                .addFields(
                    { name: 'Status', value: '```fix\nOffline```' },
                    { name: 'IP SERVER', value: "```bash\n" + config.ip + "```" },
                    { name: 'IP TS', value: "```bash\n" + config.ts3 + "```" },
                )

        } else {
            var embed = new MessageEmbed()
                .setColor('#2F3136')
                .setThumbnail(config.Logo)
                .setDescription(`Utilize os links para acessar nosso servidor.`)
                .addFields(
                    { name: 'Status', value: '```fix\nOnline```', inline: true },
                    { name: 'Jogadores Online', value: "```ini\n[ " + data.players + "/250 ]```", inline: true },
                    { name: 'IP SERVER', value: "```bash\n" + config.ip + "```" },
                    { name: 'IP TS', value: "```bash\n" + config.ts3 + "```" },
                )

        }

        const autoconnect = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setStyle("LINK")
            .setLabel(`FiveM`)
            .setEmoji('878251971021246465')
            .setURL(config.CFX.url),
        
            new MessageButton()
            .setStyle("LINK")
            .setLabel(`TeamSpeak3`)
            .setEmoji('878251970895429693')
            .setURL(config.TS3.url)
            );

        await client.channels.cache.get(config.Canal).send({
      embeds: [embed], components: [autoconnect]
    }).then(msg => {
            setInterval(() => {
                if (data.players === -1) {
                    embed.color = "RED"
                    embed.fields[0] = {name : 'Status' , value : '```fix\nOffline```'}
                    msg.edit(embed)
                } else {
                    embed.description = `Utilize os links para acessar nosso servidor.`
                    embed.fields[1] = { name: 'Jogadores Online', value: "```ini\n[ " + data.players + "/250 ]```", inline: true }
                    msg.edit(embed)
                }
            }, 30000);
        })
    }


    autoconnect()

    setInterval(() => {
        client.user.setStatus('dnd');
        client.user.setActivity(`${config.name} com ${data.players} players.`, { type: 'PLAYING' })
        players_online()
    }, 10000)

})

client.login(config.token)
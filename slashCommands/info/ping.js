const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ButtonStyle } = require('discord.js');
const makeRequest = require('../../functions/apiRequest');

module.exports = {
	name: 'ping',
	description: "Check bot's ping.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
		const response = await makeRequest('GET', '/ping');
		const apiPing = response.headers.get('x-response-time');
		const embed = new EmbedBuilder()
		.setTitle('My Ping:')
	    .setDescription(`🏓 • Discord **${Math.round(client.ws.ping)} ms**\n🏓 • API **${apiPing} ms**`)
		.setColor('#03fcdb')
		.setTimestamp()
		.setThumbnail(client.user.displayAvatarURL())
		.setFooter({ text: client.user.tag })

		const actionRow = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
			.setLabel('Status')
			.setURL(`https://status.${process.env.DOMAIN}`)
			.setStyle(ButtonStyle.Link)
		])
		return interaction.reply({ embeds: [embed], components: [actionRow] })
	}
};
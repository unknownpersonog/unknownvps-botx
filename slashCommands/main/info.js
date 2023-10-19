const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const getUserDetails = require('../../functions/getUserDetails');
const getVPSDetails = require('../../functions/getVPSDetails');
const checkUserExists = require('../../functions/checkIfRegistered');

module.exports = {
	name: 'info',
	description: "Get your user info from the API",
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction) => {
    try {
	 await interaction.reply({content: 'Retrieving user info...', ephemeral: true})
	 if (!(await checkUserExists(`${interaction.user.id}`))) {
		return interaction.editReply({ content: 'You are not registered.', ephemeral: true })
	 }
	 const userData = await getUserDetails(`${interaction.user.id}`)
	 
	 async function verificationStatus() {
		if (await userData.verified === 'true') {
			return 'Verified'
		} else {
			return 'Not verified'
		}
	 }	 
     const embed = new EmbedBuilder()
		.setTitle('Your User Info')
        .setDescription(`**Username**: ${interaction.user.tag}\n**Email**: ${userData.email}\n**VPS Owned**: ${userData.vps.length - 1}\n**Verification**: ${await verificationStatus()}`)
		.setColor('#03fcdb')
		.setTimestamp()
		.setThumbnail(interaction.user.displayAvatarURL())
		.setFooter({ text: client.user.tag })
		return interaction.editReply({ content: '', embeds: [embed], ephemeral: true })
    } catch (err) {
        return interaction.editReply({ content: 'Internal Server Error' });
    }
    }
};

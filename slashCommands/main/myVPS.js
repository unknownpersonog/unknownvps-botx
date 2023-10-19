const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const getUserDetails = require('../../functions/getUserDetails');
const getVPSDetails = require('../../functions/getVPSDetails');
const checkUserExists = require('../../functions/checkIfRegistered');
const verificationCheck = require('../../middlewares/verificationCheck');

module.exports = {
	name: 'myvps',
	description: "Get your vps data from the API",
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction) => {
    try {
	 await interaction.reply({content: 'Retrieving your VPS info...', ephemeral: true})
	 if (!(await checkUserExists(`${interaction.user.id}`))) {
		return interaction.editReply({ content: 'You are not registered.', ephemeral: true })
	 }

     if (!(await verificationCheck(`${interaction.user.id}`))) {
        return interaction.editReply({ content: 'You are not verified', ephemeral: true })
     }
	 const userData = await getUserDetails(`${interaction.user.id}`)
     const vpsDetailsPromises = userData.vps.map(vps => getVPSDetails(vps.id));
	 const vpsDetails = await Promise.all(vpsDetailsPromises);
     let vpsInfo = '';
     if (vpsDetails.length - 1 === 0) {
         vpsInfo = 'No VPS found.';
     } else {
         for (let i = 1; i < vpsDetails.length; i++) {
             vpsInfo += `**VPS ${i} Details**:\n`;
             vpsInfo += `- Name: ${vpsDetails[i].name}\n`; // replace with actual property names
             vpsInfo += `- OS: ${vpsDetails[i].os}\n`; // replace with actual property names
             vpsInfo += `- Password: ${vpsDetails[i].password}\n`; // replace with actual property names
             vpsInfo += `- User: ${vpsDetails[i].user}\n`; // replace with actual property names
             vpsInfo += `- Port: ${vpsDetails[i].port}\n`; // replace with actual property names
             vpsInfo += `- Plan: ${vpsDetails[i].plan}\n`; // replace with actual property names
             vpsInfo += '\n'; // add a newline for spacing
         }
     }

	 async function verificationStatus(userId) {
		if (userData.verified === 'true') {
			return 'Verified'
		} else {
			return 'Not verified'
		}
	 }	 
     const embed = new EmbedBuilder()
		.setTitle('Your VPS Data')
        .setDescription(`${vpsInfo}**VPS Owned**: ${userData.vps.length - 1}`)
		.setColor('#03fcdb')
		.setTimestamp()
		.setThumbnail(interaction.user.displayAvatarURL())
		.setFooter({ text: client.user.tag })
		return interaction.editReply({ content: '', embeds: [embed], ephemeral: true })
    } catch (err) {
        console.log(err)
        return interaction.editReply({ content: 'Internal Server Error' });
    }
    }
};

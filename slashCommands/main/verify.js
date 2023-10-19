const { MessageActionRow, MessageButton, EmbedBuilder } = require('discord.js');
const makeRequest = require('../../functions/apiRequest');
const getUserDetails = require('../../functions/getUserDetails');

module.exports = {
    name: 'verify',
    description: "Verify your email with us",
    cooldown: 3000,
    run: async (client, interaction) => {
        try {
            // Defer the reply
            await interaction.deferReply({ ephemeral: true });

            const userData = await getUserDetails(`${interaction.user.id}`);
            if (userData.verified === 'true') {
                return interaction.editReply({ content: 'You are already verified!' })
            }
            await makeRequest('POST', '/users/verify/mail', { discordId: interaction.user.id, email: userData.email });

            // Ask the user to enter their token
            await interaction.editReply('Please enter your 6-digit token:');
            const filter = m => m.author.id === interaction.user.id;
            const userResponse = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });

            // Get the first message in the collected messages
            const tokenMessage = userResponse.first();

            // Get the content of the message
            const token = tokenMessage.content;

            // Validate the token
            if (!/^\d{6}$/.test(token)) {
                return interaction.editReply({ content: 'Invalid token. Please try again with a valid token.', ephemeral: true });
            }

            await tokenMessage.delete();

            const tokenCheck = await makeRequest('POST', '/users/verify/token', { discordId: interaction.user.id, token: token });

            if (tokenCheck.response.status === 200) {
                const embed = new EmbedBuilder()
                    .setTitle('Verification Success')
                    .setDescription('Your E-Mail has been successfully verified!')
                    .setColor('Green')
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

                return interaction.editReply({ content: '', embeds: [embed] })
            } else {
                return interaction.editReply({ content: 'There was a error while verifying'})
            }
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: `Internal Server Error`, ephemeral: false });
        }
    }
};
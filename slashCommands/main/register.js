const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const makeRequest = require('../../functions/apiRequest');
const checkUserExists = require('../../functions/checkIfRegistered');

module.exports = {
	name: 'register',
	description: "Register your email with us",
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
	options: [
                {
                    name: 'email',
                    description: 'Your email',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ],
	run: async (client, interaction) => {
            try {
                if (await checkUserExists(`${interaction.user.id}`)) {
                    return interaction.reply({ content: 'You are already registered!'})
                }
                const email = interaction.options.get('email').value;

                // Simple regex for email validation
                const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

                if (!emailRegex.test(email)) {
                   return interaction.reply({ content: `The provided email is not valid. Please provide a valid email.`, ephemeral: true });
                }
                await interaction.reply({ content: `Creating User...` });

                const result = await makeRequest('POST', '/users/create', { email: email, discordId: interaction.user.id })
                if (result.response.status === 200) { 
                    const embed = new EmbedBuilder()
                    .setTitle('Registration Success')
                    .setDescription('You have been successfully registered')
                    .setColor('Green')
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

                
                    return await interaction.editReply({ content: '', embeds: [embed] });
                } else {
                    return interaction.editReply({ content: `Email is already registered.`, ephemeral: true });
                }

            } catch {
                return interaction.reply({ content: `Internal Server Error`, ephemeral: false });
            }

	}
};

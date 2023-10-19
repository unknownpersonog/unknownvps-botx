const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const makeRequest = require('../../functions/apiRequest');
const checkUserExists = require('../../functions/checkIfRegistered');
const verificationCheck = require('../../middlewares/verificationCheck');
const getUserDetails = require('../../functions/getUserDetails');

module.exports = {
	name: 'createvps',
	description: "Create a VPS",
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
	options: [
                {
                    name: 'plan',
                    description: 'VPS Plan',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: 'Free',
                            value: 'free'
                        }
                    ]
                }
            ],
	run: async (client, interaction) => {
            try {
                if (!(await checkUserExists(`${interaction.user.id}`))) {
                    return interaction.reply({ content: 'You are not registered!', ephemeral:true })
                }
                if (!(await verificationCheck(`${interaction.user.id}`))) {
                    return interaction.reply({ content: 'You are not verified.', ephemeral:true })
                }
                
                await interaction.reply({ content: 'Trying to create VPS...', ephemeral:true })
                const userData = await getUserDetails(`${interaction.user.id}`)
                if (!((userData.vps.length - 1) === 0)) {
                    return interaction.editReply({ content: 'You already have a VPS.', ephemeral: true})
                }

                const result = await makeRequest('POST', '/vps/assign', { discordId: interaction.user.id, plan: interaction.options.getString('plan') })
                if (result.response.status === 200) { 
                    const embed = new EmbedBuilder()
                    .setTitle('VPS Creation Success')
                    .setDescription('VPS has been assigned to you, check using /myvps')
                    .setColor('Green')
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

                
                    return await interaction.editReply({ content: '', embeds: [embed] });
                } else {
                    return interaction.editReply({ content: `VPS Out of Stock!`, ephemeral: true });
                }

            } catch (err) {
                console.log(err)
                return await interaction.editReply({ content: `Internal Server Error`, ephemeral: false });
            }

	}
};

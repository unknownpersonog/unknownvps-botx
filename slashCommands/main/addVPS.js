const { Permissions, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const makeRequest = require('../../functions/apiRequest');
const checkUserExists = require('../../functions/checkIfRegistered');

module.exports = {
	name: 'addvps',
	description: "Add a VPS to database",
	cooldown: 3000,
    default_member_permissions: 'Administrator',
	type: ApplicationCommandType.ChatInput,
	options: [
                {
                    name: 'name',
                    description: 'VPS Name',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'os',
                    description: 'VPS OS',
                    type: ApplicationCommandOptionType.String,
                    required: true 
                },
                {
                    name: 'pass',
                    description: 'VPS Password',
                    type: ApplicationCommandOptionType.String,
                    required: true 
                },
                {
                    name: 'user',
                    description: 'VPS User',
                    type: ApplicationCommandOptionType.String,
                    required: true 
                },
                {
                    name: 'ip',
                    description: 'VPS IP',
                    type: ApplicationCommandOptionType.String,
                    required: true 
                },
                {
                    name: 'plan',
                    description: 'VPS Plan',
                    type: ApplicationCommandOptionType.String,
                    required: true 
                }
            ],
	run: async (client, interaction) => {
            try {
                const specificUserIds = process.env.AUTHORIZED_USER_IDS.split(',');
                if (!specificUserIds.includes(interaction.user.id)) {
                    return interaction.reply({ content: 'You do not have permission to use this command!'})
                }
                if (!await checkUserExists(`${interaction.user.id}`)) {
                    return interaction.reply({ content: 'You are not registered!'})
                }
                await interaction.reply({ content: 'Trying to add the VPS...', ephemeral: true })
                const name = interaction.options.get('name').value;
                const os = interaction.options.get('os').value;
                const pass = interaction.options.get('pass').value;
                const user = interaction.options.get('user').value;
                const ip = interaction.options.get('ip').value;
                const plan = interaction.options.get('plan').value;

                const result = await makeRequest('POST', '/vps/add', { vps_name: name, vps_os: os, vps_pass: pass, vps_user: user, vps_ip: ip, vps_plan: plan })

                if (result.response.status === 200) {
                    return interaction.editReply({ content: 'VPS has been added.', ephemeral: true })
                } else {
                    console.log(result.response.status)
                    return interaction.editReply({ content: 'Error during adding VPS', ephemeral: true })
                }
            } catch (err) {
                console.log(err)
                return interaction.editReply({ content: `Internal Server Error`, ephemeral: false });
            }

	}
};

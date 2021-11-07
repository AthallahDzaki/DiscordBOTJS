const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    option : {
        status : false
    },
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Server Status!')
        .addStringOption(option =>
            option.setName("test")
              .setDescription("Some argument")
              .setRequired(option.required)
              .addChoice("Arg A", "A")
              .addChoice("Arg B", "B")
          ),
	async execute(client, message, args, interaction = false) {
        if(interaction) {
            await client.deferReply();
            const res = ShowCPU()
		    return await client.editReply(res);
        } else {
            await message.channel.send(ShowCPU());
        }
	},
};

function ShowCPU()
{
    let os = require('os')
    let util = require('util')
    let { performance } = require('perf_hooks')
    let { sizeFormatter } = require('human-readable')
    let format = sizeFormatter({
      std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
      decimalPlaces: 2,
      keepTrailingZeroes: false,
      render: (literal, symbol) => `${literal} ${symbol}B`,
    })
    const used = process.memoryUsage()
    const cpus = os.cpus().map(cpu => {
      cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
      return cpu
    })
    const cpu = cpus.reduce((last, cpu, _, { length }) => {
      last.total += cpu.total
      last.speed += cpu.speed / length
      last.times.user += cpu.times.user
      last.times.nice += cpu.times.nice
      last.times.sys += cpu.times.sys
      last.times.idle += cpu.times.idle
      last.times.irq += cpu.times.irq
      return last
    }, {
      speed: 0,
      total: 0,
      times: {
        user: 0,
        nice: 0,
        sys: 0,
        idle: 0,
        irq: 0
      }
    })
    let old = performance.now()
    let neww = performance.now()
    let speed = neww - old
    let txt = `
Response on ${speed} ms
💻 *Server Info* :
RAM: ${format(os.totalmem() - os.freemem())} / ${format(os.totalmem())}
NodeJS Memory Usage
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${format(used[key])}`).join('\n')}
${cpus[0] ? `_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
CPU Core(s) Usage (${cpus.length} Core CPU)
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
`.trim()
    return txt;
}
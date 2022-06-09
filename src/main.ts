/** @license
 *  console-monkey, a terrible discord bot.
 *
 *  Copyright (C) 2022  Vadász Balázs <balazs@vadasz.xyz>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { randomBytes } from 'crypto';
import { Client } from 'discord.js';

if (DEBUG) {
	(await import('dotenv')).config({
		path: PROJECT_DIR + '/.env',
	});
}

const client = new Client({ intents: 0xffff });

client.once('ready', (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('voiceStateUpdate', async (old_state, new_state) => {
	if (new_state.channel) {
		let channel_joinded = new_state.channel;
		if (channel_joinded.name.endsWith('-maker')) {
			let channel = await channel_joinded.parent!.createChannel(
				`lobby-${randomBytes(4).toString('hex')}`,
				{ type: 'GUILD_VOICE' }
			);
			new_state.setChannel(channel);
		}
	}
	if (old_state.channel) {
		let channel_left = old_state.channel;
		if (channel_left.name.startsWith('lobby-')) {
			if (channel_left.members.size == 0) {
				channel_left.delete();
			}
		}
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);

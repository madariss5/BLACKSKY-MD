const config = require('../../config');

module.exports = {
    name: 'groupmenu',
    description: 'Group management commands menu',
    async execute(sock, msg, args) {
        const menuText = `*👥 𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻 Group Commands 👥*\n\n` +
            `📊 *Basic Group Management*\n` +
            `${config.prefix}groupinfo - Display group information\n` +
            `${config.prefix}memberlist - List all group members\n` +
            `${config.prefix}admins - List group admins\n` +
            `${config.prefix}grouplink - Get group invite link\n` +
            `${config.prefix}groupstats - Group activity statistics\n` +
            `${config.prefix}setname - Change group name\n` +
            `${config.prefix}setdesc - Set group description\n` +
            `${config.prefix}setppgc - Set group icon\n` +
            `${config.prefix}revoke - Reset group link\n` +
            `${config.prefix}rules - Set/view group rules\n\n` +

            `⚙️ *Group Settings*\n` +
            `${config.prefix}group open/close - Open/close group\n` +
            `${config.prefix}welcome on/off - Toggle welcome message\n` +
            `${config.prefix}antilink on/off - Toggle anti-link\n` +
            `${config.prefix}autosticker on/off - Auto sticker mode\n` +
            `${config.prefix}nsfw on/off - Toggle NSFW content\n` +
            `${config.prefix}autoquote on/off - Auto quote replies\n` +
            `${config.prefix}autoread on/off - Auto read messages\n` +
            `${config.prefix}antiporn on/off - Block adult content\n` +
            `${config.prefix}antitext on/off - Block text spam\n` +
            `${config.prefix}antivideo on/off - Block video spam\n\n` +

            `🛡️ *Group Protection*\n` +
            `${config.prefix}antispam on/off - Spam protection\n` +
            `${config.prefix}antiflood on/off - Flood protection\n` +
            `${config.prefix}antifake on/off - Fake number filter\n` +
            `${config.prefix}antibot on/off - Block other bots\n` +
            `${config.prefix}antidelete on/off - Delete message log\n` +
            `${config.prefix}antiraid on/off - Raid protection\n` +
            `${config.prefix}antitoxic on/off - Filter toxic words\n` +
            `${config.prefix}antivirus on/off - Block malicious links\n` +
            `${config.prefix}antiexplicit on/off - Block explicit content\n` +
            `${config.prefix}antiphishing on/off - Block phishing URLs\n\n` +

            `👮 *Admin Actions*\n` +
            `${config.prefix}kick - Remove member from group\n` +
            `${config.prefix}add - Add member to group\n` +
            `${config.prefix}promote - Make member admin\n` +
            `${config.prefix}demote - Remove admin status\n` +
            `${config.prefix}warn - Warn a member\n` +
            `${config.prefix}clearwarns - Clear member warnings\n` +
            `${config.prefix}mute - Mute member temporarily\n` +
            `${config.prefix}unmute - Remove member mute\n` +
            `${config.prefix}ban - Ban member permanently\n` +
            `${config.prefix}unban - Remove member ban\n\n` +

            `📢 *Announcements*\n` +
            `${config.prefix}announce - Send announcement\n` +
            `${config.prefix}tagall - Mention all members\n` +
            `${config.prefix}hidetag - Hidden tag all\n` +
            `${config.prefix}emergency - Alert all admins\n` +
            `${config.prefix}broadcast - Send group broadcast\n` +
            `${config.prefix}notify - Send notification\n` +
            `${config.prefix}alert - Send alert message\n` +
            `${config.prefix}reminder - Set group reminder\n` +
            `${config.prefix}schedule - Schedule message\n` +
            `${config.prefix}poll - Create group poll\n\n` +

            `🎮 *Group Activities*\n` +
            `${config.prefix}game - Start group game\n` +
            `${config.prefix}quiz - Start quiz session\n` +
            `${config.prefix}tournament - Start tournament\n` +
            `${config.prefix}event - Create group event\n` +
            `${config.prefix}challenge - Group challenge\n` +
            `${config.prefix}trivia - Start trivia game\n` +
            `${config.prefix}wordchain - Word chain game\n` +
            `${config.prefix}riddle - Group riddle game\n` +
            `${config.prefix}mathgame - Math challenge\n` +
            `${config.prefix}pictionary - Drawing game\n\n` +

            `📊 *Group Analytics*\n` +
            `${config.prefix}activity - Member activity stats\n` +
            `${config.prefix}topchatter - Most active members\n` +
            `${config.prefix}inactive - Inactive members list\n` +
            `${config.prefix}chatrate - Message frequency stats\n` +
            `${config.prefix}memberstats - Member statistics\n` +
            `${config.prefix}grouprank - Member rankings\n` +
            `${config.prefix}dailystats - Daily activity report\n` +
            `${config.prefix}weeklystats - Weekly summary\n` +
            `${config.prefix}monthlyreport - Monthly analysis\n` +
            `${config.prefix}leaderboard - Activity leaderboard\n\n` +

            `🎭 *Role Management*\n` +
            `${config.prefix}setrole - Set member role\n` +
            `${config.prefix}removerole - Remove member role\n` +
            `${config.prefix}roles - List available roles\n` +
            `${config.prefix}roleinfo - Role information\n` +
            `${config.prefix}rolemembers - List role members\n` +
            `${config.prefix}createrole - Create new role\n` +
            `${config.prefix}deleterole - Delete role\n` +
            `${config.prefix}modifyrole - Modify role permissions\n` +
            `${config.prefix}assignrole - Assign role to member\n` +
            `${config.prefix}revokerole - Revoke role from member\n\n` +

            `🔧 *Group Configuration*\n` +
            `${config.prefix}setlang - Set group language\n` +
            `${config.prefix}timezone - Set group timezone\n` +
            `${config.prefix}prefix - Change command prefix\n` +
            `${config.prefix}automod - Configure auto moderation\n` +
            `${config.prefix}filter - Add message filter\n` +
            `${config.prefix}clearfilters - Remove all filters\n` +
            `${config.prefix}botperm - Bot permissions\n` +
            `${config.prefix}greetings - Welcome/leave messages\n` +
            `${config.prefix}autorole - Auto role settings\n` +
            `${config.prefix}logging - Activity logging\n\n` +

            `📝 *Group Notes*\n` +
            `${config.prefix}note - Create group note\n` +
            `${config.prefix}notes - List all notes\n` +
            `${config.prefix}delnote - Delete note\n` +
            `${config.prefix}editnote - Edit existing note\n` +
            `${config.prefix}pinnote - Pin important note\n` +
            `${config.prefix}unpinnote - Unpin note\n` +
            `${config.prefix}clearnotes - Delete all notes\n` +
            `${config.prefix}shownote - Display note content\n` +
            `${config.prefix}searchnote - Search in notes\n` +
            `${config.prefix}exportnotes - Export all notes\n\n` +

            `📅 *Event Management*\n` +
            `${config.prefix}createevent - Create new event\n` +
            `${config.prefix}editevent - Modify event details\n` +
            `${config.prefix}delevent - Delete event\n` +
            `${config.prefix}events - List all events\n` +
            `${config.prefix}eventinfo - Event details\n` +
            `${config.prefix}rsvp - Respond to event\n` +
            `${config.prefix}attendees - List event attendees\n` +
            `${config.prefix}schedule - Schedule new event\n` +
            `${config.prefix}reminder - Set event reminder\n` +
            `${config.prefix}calendar - Group calendar\n\n` +

            `🔄 *Auto Responses*\n` +
            `${config.prefix}autoresponse - Set auto reply\n` +
            `${config.prefix}delresponse - Delete auto reply\n` +
            `${config.prefix}responses - List auto replies\n` +
            `${config.prefix}trigger - Add response trigger\n` +
            `${config.prefix}deltrigger - Remove trigger\n` +
            `${config.prefix}customcmd - Create custom command\n` +
            `${config.prefix}delcmd - Delete custom command\n` +
            `${config.prefix}cmdlist - List custom commands\n` +
            `${config.prefix}disablecmd - Disable command\n` +
            `${config.prefix}enablecmd - Enable command\n\n` +

            `📊 *Polls & Voting*\n` +
            `${config.prefix}createpoll - Create new poll\n` +
            `${config.prefix}endpoll - End active poll\n` +
            `${config.prefix}vote - Cast your vote\n` +
            `${config.prefix}pollstats - Poll statistics\n` +
            `${config.prefix}polls - List active polls\n` +
            `${config.prefix}pollinfo - Poll details\n` +
            `${config.prefix}revote - Change your vote\n` +
            `${config.prefix}quickpoll - Quick yes/no poll\n` +
            `${config.prefix}survey - Create detailed survey\n` +
            `${config.prefix}pollresults - Show poll results\n\n` +

            `🎯 *Group Goals*\n` +
            `${config.prefix}setgoal - Set group goal\n` +
            `${config.prefix}goals - List active goals\n` +
            `${config.prefix}progress - Goal progress\n` +
            `${config.prefix}completegoal - Mark goal complete\n` +
            `${config.prefix}deletegoal - Remove group goal\n` +
            `${config.prefix}milestone - Add goal milestone\n` +
            `${config.prefix}target - Set target date\n` +
            `${config.prefix}goalinfo - Goal details\n` +
            `${config.prefix}contribute - Contribute to goal\n` +
            `${config.prefix}goalstats - Goal statistics\n\n` +

            `📌 *Pinned Messages*\n` +
            `${config.prefix}pin - Pin message\n` +
            `${config.prefix}unpin - Unpin message\n` +
            `${config.prefix}pins - List pinned messages\n` +
            `${config.prefix}clearpin - Clear all pins\n` +
            `${config.prefix}pininfo - Pinned message info\n` +
            `${config.prefix}pinnedby - Pin author info\n` +
            `${config.prefix}pintime - Pin timestamp\n` +
            `${config.prefix}pinhistory - Pin history\n` +
            `${config.prefix}pinmsg - Show pinned message\n` +
            `${config.prefix}pinsearch - Search pins\n\n` +

            `🔗 *Invite Management*\n` +
            `${config.prefix}invite - Create invite link\n` +
            `${config.prefix}revoke - Revoke invite link\n` +
            `${config.prefix}invites - List active invites\n` +
            `${config.prefix}inviteinfo - Invite details\n` +
            `${config.prefix}tempinvite - Temporary invite\n` +
            `${config.prefix}invitestats - Invite statistics\n` +
            `${config.prefix}delinvite - Delete invite\n` +
            `${config.prefix}invitelink - Get group link\n` +
            `${config.prefix}invitehistory - Invite history\n` +
            `${config.prefix}resetinvites - Reset all invites\n\n` +

            `🔒 *Security Settings*\n` +
            `${config.prefix}security - Security settings\n` +
            `${config.prefix}verification - Set verification\n` +
            `${config.prefix}restrict - Restrict features\n` +
            `${config.prefix}unrestrict - Remove restrictions\n` +
            `${config.prefix}lockdown - Enable lockdown\n` +
            `${config.prefix}unlock - Disable lockdown\n` +
            `${config.prefix}securitylog - Security logs\n` +
            `${config.prefix}trustuser - Add trusted user\n` +
            `${config.prefix}untrust - Remove trusted user\n` +
            `${config.prefix}trusted - List trusted users\n\n` +

            `📋 *Member Lists*\n` +
            `${config.prefix}members - List all members\n` +
            `${config.prefix}online - Show online members\n` +
            `${config.prefix}offline - Show offline members\n` +
            `${config.prefix}recent - Recently active\n` +
            `${config.prefix}inactive - Inactive members\n` +
            `${config.prefix}joined - Join date list\n` +
            `${config.prefix}membersince - Member duration\n` +
            `${config.prefix}oldest - Oldest members\n` +
            `${config.prefix}newest - Newest members\n` +
            `${config.prefix}search - Search members\n\n` +

            `🎨 *Group Customization*\n` +
            `${config.prefix}settheme - Set group theme\n` +
            `${config.prefix}customize - Customize appearance\n` +
            `${config.prefix}seticon - Change group icon\n` +
            `${config.prefix}banner - Set group banner\n` +
            `${config.prefix}background - Chat background\n` +
            `${config.prefix}font - Change message font\n` +
            `${config.prefix}color - Text color settings\n` +
            `${config.prefix}style - Message style\n` +
            `${config.prefix}layout - Chat layout\n` +
            `${config.prefix}reset - Reset customization\n\n` +

            `📈 *Group Economy*\n` +
            `${config.prefix}points - Point system\n` +
            `${config.prefix}rewards - Group rewards\n` +
            `${config.prefix}shop - Group shop\n` +
            `${config.prefix}transfer - Transfer points\n` +
            `${config.prefix}balance - Check balance\n` +
            `${config.prefix}daily - Daily bonus\n` +
            `${config.prefix}weekly - Weekly reward\n` +
            `${config.prefix}lottery - Group lottery\n` +
            `${config.prefix}leaderboard - Point rankings\n` +
            `${config.prefix}transactions - Point history\n\n` +

            `🎪 *Group Events*\n` +
            `${config.prefix}tournament - Start tournament\n` +
            `${config.prefix}contest - Create contest\n` +
            `${config.prefix}giveaway - Start giveaway\n` +
            `${config.prefix}raffle - Start raffle\n` +
            `${config.prefix}challenge - Group challenge\n` +
            `${config.prefix}competition - New competition\n` +
            `${config.prefix}event - Create event\n` +
            `${config.prefix}party - Start group party\n` +
            `${config.prefix}celebration - Group celebration\n` +
            `${config.prefix}awards - Give awards\n\n` +

            `🤖 *Bot Interaction*\n` +
            `${config.prefix}bothelp - Bot help menu\n` +
            `${config.prefix}botstatus - Bot status\n` +
            `${config.prefix}botinfo - Bot information\n` +
            `${config.prefix}ping - Check bot ping\n` +
            `${config.prefix}report - Report issue\n` +
            `${config.prefix}feedback - Send feedback\n` +
            `${config.prefix}request - Feature request\n` +
            `${config.prefix}donate - Support bot\n` +
            `${config.prefix}premium - Premium features\n` +
            `${config.prefix}credits - Bot credits\n\n` +

            `⚠️ Note: Some commands require admin privileges.\n` +
            `Total Commands: 300`;

        await sock.sendMessage(msg.key.remoteJid, { 
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: "𝔹𝕃𝔸ℂ𝕂𝕊𝕂𝕐-𝕄𝔻",
                    body: "Group Commands Menu",
                    showAdAttribution: true
                }
            }
        });
    }
};
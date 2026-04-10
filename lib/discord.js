
const SUBMISSION_WEBHOOK_URL = process.env.DISCORD_SUBMISSION_WEBHOOK_URL;
const STATUS_WEBHOOK_URL = process.env.DISCORD_STATUS_WEBHOOK_URL;

const COLORS = {
  PENDING: 0xF59E0B,    // amber-500
  APPROVED: 0x10B981,   // emerald-500
  REJECTED: 0xEF4444,   // red-500
  INFO: 0x3B82F6        // blue-500
};

// Discord emojis
const EMOJIS = {
  TICK: ':white_check_mark:',
  CROSS: ':x:',
  VEXANODE: ':globe_with_meridians:'
};

function createEmbed(title, description, color, fields = [], footer = null) {
  const embed = {
    title: `${EMOJIS.VEXANODE} ${title}`,
    description,
    color,
    fields,
    timestamp: new Date().toISOString(),
    footer: footer || {
      text: 'Vexanode Lavalink Grid',
      icon_url: null
    }
  };
  return embed;
}

async function sendWebhook(webhookUrl, embed) {
  if (!webhookUrl) {
    console.warn('Webhook URL not configured, skipping Discord notification');
    return;
  }

  try {
    const payload = {
      embeds: [embed],
      username: 'Vexanode Grid Bot',
      avatar_url: null
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    }

    console.log('Discord notification sent successfully');
  } catch (error) {
    console.error('Failed to send Discord webhook:', error);
  }
}

// Send notification for new node submission
export async function notifyNodeSubmission(nodeData) {
  const embed = createEmbed(
    'New Node Submission',
    `${EMOJIS.TICK} **New node submitted for verification**\n\n**Identifier:** ${nodeData.identifier}\n**Host:** ${nodeData.host}:${nodeData.port}\n**Author:** ${nodeData.authorId}\n**Secure:** ${nodeData.secure ? 'Yes' : 'No'}\n**Version:** ${nodeData.restVersion}`,
    COLORS.PENDING,
    [
      {
        name: 'Connection Details',
        value: `Protocol: ${nodeData.secure ? 'HTTPS/WSS' : 'HTTP/WS'}\nAPI Version: ${nodeData.restVersion}`,
        inline: true
      },
      {
        name: 'Operator Info',
        value: `Author: ${nodeData.authorId}\n${nodeData.website ? `Website: ${nodeData.website}` : ''}${nodeData.discord ? `\nDiscord: ${nodeData.discord}` : ''}`,
        inline: true
      }
    ],
    {
      text: 'Awaiting admin approval',
      icon_url: null
    }
  );

  await sendWebhook(SUBMISSION_WEBHOOK_URL, embed);
}

// Send notification for node status change (approved/rejected)
export async function notifyNodeStatusChange(nodeData, oldStatus, newStatus, reason = null) {
  const isApproved = newStatus === 'approved';
  const emoji = isApproved ? EMOJIS.TICK : EMOJIS.CROSS;
  const color = isApproved ? COLORS.APPROVED : COLORS.REJECTED;
  const statusText = isApproved ? 'Approved' : 'Rejected';

  const fields = [
    {
      name: 'Node Details',
      value: `Secure: ${nodeData.secure ? 'Yes' : 'No'}\nVersion: ${nodeData.restVersion}`,
      inline: true
    },
    {
      name: 'Operator',
      value: nodeData.authorId,
      inline: true
    }
  ];

  if (reason) {
    fields.push({
      name: 'Reason',
      value: reason,
      inline: false
    });
  }

  const embed = createEmbed(
    `Node ${statusText}`,
    `${emoji} **Node status updated**\n\n**Identifier:** ${nodeData.identifier}\n**Host:** ${nodeData.host}:${nodeData.port}\n**Author:** ${nodeData.authorId}\n**Status:** ${oldStatus} -> ${newStatus}`,
    color,
    fields,
    {
      text: `Node ${statusText.toLowerCase()} by admin`,
      icon_url: null
    }
  );

  await sendWebhook(STATUS_WEBHOOK_URL, embed);
}

// Send notification for node deletion
export async function notifyNodeDeletion(nodeData) {
  const embed = createEmbed(
    'Node Deleted',
    `${EMOJIS.CROSS} **Node removed from grid**\n\n**Identifier:** ${nodeData.identifier}\n**Host:** ${nodeData.host}:${nodeData.port}\n**Author:** ${nodeData.authorId}`,
    COLORS.REJECTED,
    [
      {
        name: 'Deleted Node',
        value: `Identifier: ${nodeData.identifier}\nHost: ${nodeData.host}:${nodeData.port}`,
        inline: true
      },
      {
        name: 'Operator',
        value: nodeData.authorId,
        inline: true
      }
    ],
    {
      text: 'Node deleted by admin',
      icon_url: null
    }
  );

  await sendWebhook(STATUS_WEBHOOK_URL, embed);
}

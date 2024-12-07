/* eslint-disable max-len */
import { ProjectWideGenerationArgs } from '../../../../args'
import { generatedWarning } from '../../../../utils'

export const ciNotifyTmpl = ({
  options
}: ProjectWideGenerationArgs) => `#!/bin/bash
${
    options.skipWarningThisIsGenerated
      ? ''
      : `
# ${generatedWarning}
  `
  }
TIME="10"
TELEGRAM_URL="https://api.telegram.org/bot$NOTIFY_TELEGRAM_BOT_TOKEN/sendMessage"
DISCORD_URL="$NOTIFY_DISCORD_WEBHOOK_URL"
TG_TEXT="Status: $1%0A%0AProject: $CI_PROJECT_NAME%0AURL: $CI_PROJECT_URL/pipelines/$CI_PIPELINE_ID/%0ABranch: $CI_COMMIT_REF_SLUG"
DISCORD_TEXT="Status: **$1**\\nProject: **$CI_PROJECT_NAME**\\nURL: $CI_PROJECT_URL/pipelines/$CI_PIPELINE_ID/\\nBranch: $CI_COMMIT_REF_SLUG\\n\\n"

# Telegram notification
curl -s --max-time $TIME -d "chat_id=$NOTIFY_TELEGRAM_CHAT_ID&disable_web_page_preview=1&text=$TG_TEXT" $TELEGRAM_URL > /dev/null

# Discord notification
curl -s --max-time $TIME -H "Content-Type: application/json" -d "{\\"content\\":\\"$DISCORD_TEXT\\",\\"allowed_mentions\\":{\\"parse\\":[]}}" $DISCORD_URL > /dev/null`
// src/utils/pollMapper.js

export function mapPollToForm(poll) {
  return {
    question: poll?.content?.question || "",
    description: poll?.content?.description || "",

    // keep id with option
    options: (poll?.content?.options || []).map(o => ({
      id: o.option_id,
      text: o.text,
      isNew: false,
      isDeleted: false
    })),

    visibility: poll?.access?.visibility || "public",
    allowed_emails: (poll?.access?.allowed_emails || []).join(","),

    allow_change: poll?.vote?.allow_change_vote ?? false,
    anonymous: poll?.vote?.anonymous_vote ?? true,

    hide_results_until_end: poll?.vote?.hide_results_until_end ?? false,
    show_voters: poll?.vote?.show_voters ?? false,
    unique_ip: poll?.vote?.unique_ip ?? false,
    unique_session: poll?.vote?.unique_session ?? false,

    auto_close: poll?.behavior?.auto_close ?? false,
    show_live_results: poll?.behavior?.show_live_results ?? false,

    start_at: poll?.behavior?.start_at || null,
    end_at: poll?.behavior?.end_at || null
  }
}


// src/utils/pollPatchBuilder.js

export function buildPollPatch(original, form) {

  const payload = {}

  // ================= CONTENT =================
  if (form.question !== original.content.question ||
      form.description !== original.content.description) {

    payload.content ??= {}
    payload.content.question = form.question
    payload.content.description = form.description
  }

  // OPTIONS DIFF
  const newOptions = form.options
    .filter(o => !o.isDeleted)
    .map(o => ({
      ...(o.id && { option_id: o.id }),
      text: o.text
    }))

  const oldOptions = original.content.options.map(o => ({
    option_id: o.option_id,
    text: o.text
  }))

  if (JSON.stringify(newOptions) !== JSON.stringify(oldOptions)) {
    payload.content ??= {}
    payload.content.options = newOptions
  }

  // ================= ACCESS =================
  if (form.visibility !== original.access.visibility) {
    payload.access ??= {}
    payload.access.visibility = form.visibility
  }

  // ================= VOTE =================
  if (form.allow_change !== original.vote.allow_change_vote ||
      form.anonymous !== original.vote.anonymous_vote) {

    payload.vote ??= {}
    payload.vote.allow_change_vote = form.allow_change
    payload.vote.anonymous_vote = form.anonymous
  }

  // ================= BEHAVIOR =================
  if (form.show_live_results !== original.behavior.show_live_results ||
      form.auto_close !== original.behavior.auto_close) {

    payload.behavior ??= {}
    payload.behavior.show_live_results = form.show_live_results
    payload.behavior.auto_close = form.auto_close
  }

  return payload
}

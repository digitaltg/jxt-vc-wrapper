import { loadFileWithPromise, loadHttpJson } from "./utils";

export async function loadHttpTemplate(url) {
  let content = await loadHttpJson(url, '[KEY]');
  return content;u
}

export async function loadJsonTemplate(path) {
  const content = JSON.parse(await loadFileWithPromise(path));
  return content
}
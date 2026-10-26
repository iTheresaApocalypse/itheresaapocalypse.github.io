const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const rootPath = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(rootPath, "_pages/about.md"), "utf8");
const source = fs.readFileSync(path.join(rootPath, "_includes/pub-filter-script.html"), "utf8").replace(/<\/?script>/g, "");
const articles = [...html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)];
const expectedSelected = ["scaling", "video", "survey", "gameverse", "eccv", "handling"];
const expectedAll = ["scaling", "onewm", "video", "snapbench", "eccv", "survey", "gameverse", "handling", "harnessing"];
const names = [...expectedSelected, "onewm", "snapbench", "harnessing"];
const selectedArticles = articles.filter(m => m[1].includes('data-selected="true"'));
assert.equal(selectedArticles.length, 6);
assert(selectedArticles.every(m => m[2].includes('include github-star-count.html')), "every selected paper has stars");
assert.equal(selectedArticles.filter(m => m[2].includes('include huggingface-download-count.html')).length, 3, "three selected papers have Hugging Face downloads");

function page({ pinnedOld = false } = {}) {
  const items = articles.map((m, index) => {
    const attributes = Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a => [a[1], a[2]]));
    if (pinnedOld && attributes["data-pinned"]) attributes["data-published"] = "2000-01-01";
    return { name: names[index], style: {}, getAttribute: key => attributes[key] };
  });
  const list = {
    children: items.slice(),
    appendChild(item) { this.children.splice(this.children.indexOf(item), 1); this.children.push(item); }
  };
  const buttons = ["selected", "all"].map(mode => ({
    attributes: { "data-pub-filter": mode },
    classList: { toggle() {} },
    getAttribute(key) { return this.attributes[key]; },
    setAttribute(key, value) { this.attributes[key] = value; },
    addEventListener(event, fn) { this.click = fn; }
  }));
  const root = {
    classList: { toggle() {} }, getAttribute: () => "selected",
    querySelector: () => list,
    querySelectorAll(selector) {
      if (selector === "[data-pub-filter]") return buttons;
      if (selector === ".pub-category-block") return [];
      return items;
    }
  };
  vm.runInNewContext(source, { document: { querySelectorAll: () => [root] } });
  return { list, buttons, visible: () => list.children.filter(i => i.style.display !== "none").map(i => i.name) };
}

let p = page();
assert.deepEqual(p.visible(), expectedSelected);
for (let i = 0; i < 3; i++) {
  p.buttons[1].click();
  assert.deepEqual(p.visible(), expectedAll, "All follows first-publication dates");
  assert.equal(p.buttons[1].attributes["aria-pressed"], "true");
  p.buttons[0].click();
  assert.deepEqual(p.visible(), expectedSelected, "Selected restores the curated order");
  assert.equal(p.buttons[0].attributes["aria-pressed"], "true");
}
p = page({ pinnedOld: true }); p.buttons[1].click();
assert.equal(p.visible().at(-1), "scaling", "pinning cannot override All chronology");
console.log("Passed: chronological All, curated Selected, repeated toggles, pin independence, and accessible filter state.");

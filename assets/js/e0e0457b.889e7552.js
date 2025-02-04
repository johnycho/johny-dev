"use strict";(self.webpackChunkjohnycho_dev=self.webpackChunkjohnycho_dev||[]).push([[133],{2663:n=>{n.exports=JSON.parse('{"archive":{"blogPosts":[{"id":"johny-dev-blog-launched","metadata":{"permalink":"/johny-dev/johny-dev-blog-launched","editUrl":"https://github.com/johnycho/johny-dev/edit/main/blog/2025-02-03-johny-dev-blog-launched.mdx","source":"@site/blog/2025-02-03-johny-dev-blog-launched.mdx","title":"\uc870\ub2c8 \uac1c\ubc1c \ube14\ub85c\uadf8 \uac1c\uc124\ud83c\udf89","description":"_","date":"2025-02-03T00:00:00.000Z","tags":[{"inline":false,"label":"Hello","permalink":"/johny-dev/tags/hello","description":"Hello tag description"},{"inline":false,"label":"Docusaurus","permalink":"/johny-dev/tags/docusaurus","description":"Docusaurus tag description"}],"readingTime":2.82,"hasTruncateMarker":true,"authors":[{"name":"Johny Cho","title":"Back End Engineer @ NHN","url":"https://github.com/johnycho","page":{"permalink":"/johny-dev/authors/johnycho"},"socials":{"github":"https://github.com/johnycho","instagram":"https://www.instagram.com/johny__cho","linkedin":"https://www.linkedin.com/in/johny-cho/"},"imageURL":"https://github.com/johnycho.png","key":"johnycho"}],"frontMatter":{"slug":"johny-dev-blog-launched","title":"\uc870\ub2c8 \uac1c\ubc1c \ube14\ub85c\uadf8 \uac1c\uc124\ud83c\udf89","authors":["johnycho"],"tags":["hello","docusaurus"]},"unlisted":false},"content":"import BrowserOnly from \'@docusaurus/BrowserOnly\';\\n\\n___\\n\\n# \ud14c\uc2a4\ud2b8 \ub9c8\ud06c \ub2e4\uc6b4 \ubb38\uc11c\ub97c \uc791\uc131\ud574\ubd05\ub2c8\ub2e4..\\n\\n\x3c!-- truncate --\x3e\\n\\n## :heavy_check_mark:\ufe0f Glorious Demo with TypeScript\\n---\\n\uc544\ub798\ub294 `glorious-demo`\ub97c \uc774\uc6a9\ud55c \uc5d0\ub514\ud130 + \ud130\ubbf8\ub110 \uc560\ub2c8\uba54\uc774\uc158 \uc608\uc81c\uc785\ub2c8\ub2e4.\\n\\n<BrowserOnly fallback={<p>Loading terminal...</p>}>\\n{() => {\\nconst GloriousTerminal = require(\'@site/src/components/GloriousTerminal\').default;\\nreturn (\\n<GloriousTerminal\\ncode={`\\nfunction greet(){\\nconsole.log(\\"Hello World!\\");\\n}\\n\\ngreet();\\n`}\\ncommand=\\"node ./demo\\"\\nresponse=\\"Hello World!\\"\\n/>\\n);\\n}}\\n</BrowserOnly>\\n\\n<br /><br /><br /><br /><br /><br />\\n\\n## :heavy_check_mark: Javascript \ucf54\ub4dc \ube14\ub7ed\\n---\\n\\n```js\\n<button onClick={() => alert(\'button clicked!\')}>Click me!</button>\\n```\\n\\n## :heavy_check_mark: Java \ucf54\ub4dc \ube14\ub7ed\\n---\\n\\n```java\\npackage com.nhn.meta.banword.application;\\n\\nimport java.util.Arrays;\\nimport java.util.Collections;\\nimport java.util.Map;\\nimport java.util.stream.Collectors;\\n\\npublic class Solution {\\n\\n  public static void main(String[] args) {\\n// \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4 \uc2e4\ud589 \ubc0f \uacb0\uacfc \ucd9c\ub825\\n    System.out.println(\\"Test Case 1 Result: \\" + solution(2, \\"1A 2F 1C\\") + \\" (Expected: 2)\\");\\n    System.out.println(\\"Test Case 2 Result: \\" + solution(3, \\"\\") + \\" (Expected: 6)\\");\\n    System.out.println(\\n        \\"Test Case 3 Result: \\" + solution(1, \\"1A 1B 1C 1D 1E 1F 1G 1H 1J 1K\\") + \\" (Expected: 0)\\");\\n    System.out.println(\\n        \\"Test Case 4 Result: \\" + solution(50, \\"1A 3C 2B 20G 5A 7K 40D 50H\\") + \\" (Expected: 95)\\");\\n    System.out.println(\\n        \\"Test Case 5 Result: \\" + solution(2, \\"1A 1C 1D 1F 1G 1J 2C 2H\\") + \\" (Expected: 1)\\");\\n    System.out.println(\\n        \\"Test Case 6 Result: \\" + solution(22, \\"1A 3C 2B 20G 5A\\") + \\" (Expected: 41)\\");\\n  }\\n\\n  public static int solution(int N, String S) {\\n    final Map<String, Boolean> reserved = splitStringToMap(S);\\n\\n    int maxFamilies = 0;\\n\\n    for (int row = 1; row <= N; row++) {\\n      boolean leftAndCenter =\\n          !reserved.containsKey(row + \\"B\\") &&\\n              !reserved.containsKey(row + \\"C\\") &&\\n              !reserved.containsKey(row + \\"D\\") &&\\n              !reserved.containsKey(row + \\"E\\");\\n\\n      boolean centerOnly =\\n          !reserved.containsKey(row + \\"D\\") &&\\n              !reserved.containsKey(row + \\"E\\") &&\\n              !reserved.containsKey(row + \\"F\\") &&\\n              !reserved.containsKey(row + \\"G\\");\\n\\n      boolean centerAndRight =\\n          !reserved.containsKey(row + \\"F\\") &&\\n              !reserved.containsKey(row + \\"G\\") &&\\n              !reserved.containsKey(row + \\"H\\") &&\\n              !reserved.containsKey(row + \\"J\\");\\n\\n      int familiesAdded = 0; // \ub514\ubc84\uae45\uc6a9 \ucd94\uac00\\n      if (leftAndCenter) {\\n        maxFamilies++;\\n        familiesAdded++;\\n      }\\n\\n      if (centerAndRight) {\\n        maxFamilies++;\\n        familiesAdded++;\\n      }\\n\\n      if (!leftAndCenter && !centerAndRight && centerOnly) {\\n        maxFamilies++;\\n        familiesAdded++;\\n      }\\n\\n      // \ud589\ubcc4\ub85c \ucd94\uac00\ub41c \uac00\uc871 \uc218 \ucd9c\ub825\\n      System.out.printf(\\n          \\"Row %d: leftAndCenter=%b, centerOnly=%b, centerAndRight=%b, Families added=%d\\\\n\\",\\n          row, leftAndCenter, centerOnly, centerAndRight, familiesAdded);\\n    }\\n\\n    return maxFamilies;\\n  }\\n\\n  public static Map<String, Boolean> splitStringToMap(String s) {\\n    if (s == null || s.trim().isEmpty()) {\\n      return Collections.emptyMap(); // \ubb38\uc790\uc5f4\uc774 \ube44\uc5b4\uc788\uc73c\uba74 \ube48 \ub9f5 \ubc18\ud658\\n    }\\n\\n    // \uacf5\ubc31 \uae30\uc900\uc73c\ub85c \ub098\ub208 \ud6c4, \uac01 \ub2e8\uc5b4\ub97c \ud0a4\ub85c, \ub2e8\uc5b4\uc758 \uae38\uc774\ub97c \uac12\uc73c\ub85c \ub9f5\uc5d0 \uc800\uc7a5\\n    return Arrays.stream(s.split(\\"\\\\\\\\s+\\")) // \uacf5\ubc31 \uae30\uc900\uc73c\ub85c \ubb38\uc790\uc5f4 \ubd84\ub9ac\\n        .filter(word -> !word.isEmpty()) // \ube44\uc5b4 \uc788\ub294 \ubb38\uc790\uc5f4 \uc81c\uac70\\n        .collect(Collectors.toMap(word -> word, word -> true));\\n  }\\n}\\n```\\n\\n## :heavy_check_mark: Task List\\n---\\n\\n- [x] Write the press release\\n- [ ] Update the website\\n- [ ] Contact the media\\n\\n## :heavy_check_mark: Using Emoji Shortcodes\\n---\\nGone camping! :tent: Be back soon.\\n\\nThat is so funny! :joy:\\n\\n## :heavy_check_mark: Highlight\\n---\\nI need to highlight these <mark>very important words</mark>.\\n\\n## :heavy_check_mark: Table\\n---\\n\\n| Syntax    | Description |\\n|-----------|-------------|\\n| Header    | Title       |\\n| Paragraph | Text        |"}]}}')}}]);
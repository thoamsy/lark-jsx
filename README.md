# Lark-JSX

要求，`ts >= 4.1`，后续考虑支持低版本。
因为只要 4.1 版本才开始支持 JSX 新的规范，这种规范不需要额外去 `import React from 'react'`

## 背景

因为 Lark 开放平台的各种奇葩类型四处散落，而且也经常出现嵌套场景，是在不太好阅读。于是通过一个自定义 JSX 解析器来让 lark 支持 JSX 语法

## 效果

没有用 JSX 工具之前 🙂

```js
{
  "tag": "action",
  "actions": [
      {
          "tag": "button",
          "text": {
              "tag": "plain_text",
              "content": "default style-button"
          },
          "type": "default"
      },
      {
          "tag": "button",
          "text": {
              "tag": "plain_text",
              "content": "primary style-button"
          },
          "type": "primary"
      },
      {
          "tag": "button",
          "text": {
              "tag": "plain_text",
              "content": "danger style-button"
          },
          "type": "danger"
      },
}
```

使用了之后 💃

```jsx
const elements = (
  <action
    actions={
      <>
        <button type="default">
          <plain_text>default style-button</plain_text>
        </button>
        <button type="primary">
          <plain_text>primary style-button</plain_text>
        </button>
        <button type="danger">
          <plain_text>danger style-button</plain_text>
        </button>
      </>
    }
  />
);
```

还支持类型检测 😏
![](../lark-jsx/resources/type-check.png)

## 配置方式

```bash
yarn add -D lark-jsx
```

打开 `tsconfig.json`，修改 `compileOptions` 的几个配置

```json
{
  "compileOptions": {
    "jsx": "react-jsx" /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */,
    "jsxImportSource": "lark-jsx",
    "types": ["lark-jsx"]
  }
}
```

## 支持

`plain_text`, `button`, `node`, `div`, `lark_md`, `text`, `a`, `at`, `hr`, `img`, `action` and 自定义组件 😉

### 自定义组件写法

```jsx
const NPMCard = ({
  committer = '没有传入提交人',
  releaseVersion = '未知版本',
  description = '',
  library = '',
}: {
  committer?: string,
  releaseVersion?: string,
  description?: string,
  library?: string,
}): Card => {
  const libraryWithVersion = (join: string) =>
    `${library}${join}${releaseVersion}`;
  const elements = (
    <>
      <div
        fields={[
          {
            is_short: false,
            text: (
              <lark_md>
                [{libraryWithVersion('@')}](https://xxx.yyy.zzz/package/
                {libraryWithVersion('/')})
              </lark_md>
            ),
          },
        ]}
      >
        <plain_text>发布成功</plain_text>
      </div>
      <hr />
      <div
        fields={[
          {
            is_short: false,
            text: <lark_md>{description}</lark_md>,
          },
        ]}
      >
        <plain_text>内容概要</plain_text>
      </div>
      <note
        elements={
          <>
            <plain_text>提交人: </plain_text>
            <plain_text>{committer}</plain_text>
          </>
        }
      />
    </>
  );

  const card = {
    header: {
      title: <plain_text>有新版本啦</plain_text>,
      template: 'green',
    },
    elements,
  };
  return card;
};

const element = <NPMCard {...card} />;
```

/* eslint-disable @typescript-eslint/no-namespace */

declare namespace Lark {
  type ElementType<P = any> = {
    [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K]
      ? K
      : never;
  }[keyof JSX.IntrinsicElements];

  interface LarkElement<T extends ElementType> {
    tag: T;
  }
}

// type LarkText = string | number;
// export interface PlainText {
//   content: string;
// }
// export interface Button {
//   type: 'default';
// }
// export interface LarkMD {
//   content: string;
// }
// export interface Text {
//   un_escape?: boolean;
//   children: LarkText;
// }
// interface Div {
//   children: LarkChild;
// }

// export interface Anchor {
//   href: string;
//   children: LarkText;
// }
// interface;
// at: {
//   user_id: string;
// }

declare global {
  namespace JSX {
    interface ElementChildrenAttribute {
      children: {};
    }
    interface PlainText {
      children: LarkText | LarkText[];
      lines?: number;
    }

    interface Field {
      is_short: boolean;
      text: PlainText;
    }
    interface Confirm {
      title: PlainText;
      text: PlainText;
    }
    interface Image {
      image_key: string;
      alt?: Text;
      title?: Text;
      mode?: 'fit_horizontal' | 'crop_center';
      width?: number;
      height?: number;
    }

    interface IntrinsicElements {
      plain_text: PlainText;
      button: {
        type?: 'default' | 'primary' | 'danger';
        children: LarkChild;
        url?: string; // 跳转链接，和multi_url互斥
        multi_url?: string; // 多端跳转链接
        value?: Record<string, unknown>;
        confirm?: Confirm;
      };
      note: {
        elements: Array<PlainText | Image>;
      };
      div: {
        children: LarkChild;
        fields?: Field[];
        extra?: JSX.LarkChild[];
      };
      lark_md: {
        children: LarkText | LarkText[];
      };
      text: {
        un_escape?: boolean;
        children: LarkText | LarkText[];
      };
      a: {
        href: string;
        children: LarkText | LarkText[];
      };
      date_picker: {
        placeholder: PlainText;
        confirm: Confirm;
      };
      at: {
        user_id: string;
      };
      hr: Record<string, never>;
      img: Image;
      action: {
        actions: LarkChild[];
        /*
        交互元素布局，窄版样式默认纵向排列
        使用 bisected 为二等分布局，每行两列交互元素
        使用 trisection 为三等分布局，每行三列交互元素
        使用 flow 为流式布局元素会按自身大小横向排列并在空间不够的时候折行
        */
        layout?: 'bisected' | 'trisection' | 'flow';
      };
    }
    type LarkElement = Lark.LarkElement<any> | JSX.LarkNodeArray;
    type LarkText = string | number;
    type LarkChild = LarkText | LarkElement;
    type LarkNode = LarkChild | LarkFragment;
    interface LarkNodeArray extends Array<LarkNode> {}
    type LarkFragment = {} | LarkNodeArray;
  }
}

// import './jsx';
export const Fragment = '__LARK__Fragment__' as const;

type TagType =
  | keyof JSX.IntrinsicElements
  | typeof Fragment
  | ((props: any) => JSX.LarkElement);

const tagUseTextAsChildren = new Set(['button', 'text', 'div', 'a']);
const tagUseContentAsChildren = new Set(['plain_text', 'lark_md']);

function jsx(
  tag: TagType,
  { children, ...props }: { children: JSX.LarkNode[] }
): JSX.LarkElement {
  if (tag === Fragment) {
    const fragments: JSX.LarkNode[] = [];
    return fragments.concat(children);
  }
  if (typeof tag === 'string') {
    const element = {
      tag,
      text: undefined as JSX.LarkChild | undefined,
      content: undefined as JSX.LarkChild | undefined,
    };

    if (children) {
      const flatChildren = Array.isArray(children)
        ? children.join('')
        : children;
      if (tagUseContentAsChildren.has(tag)) {
        element.content = flatChildren;
      }
      if (tagUseTextAsChildren.has(tag)) {
        element.text = flatChildren;
      }
    }
    Object.assign(element, props);
    return element;
  } else {
    return tag({ children, ...props });
  }
}
// TOOD: jsxs's children will must be the array, so I can do something to optimize the logic, and
// support the fragment just to represent the array
const jsxs = jsx;

export { jsx, jsxs };

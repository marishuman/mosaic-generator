import * as React from 'react';
import { nil, cons, equals, rev } from './list';
import { Square, Path } from './square';
import './square_draw.css';


/** Properties allowed on a square element */
export interface SquareProps {
  /** Tree of squares to draw. */
  square: Square;

  /** Width of the entire drawing. */
  width: number;

  /** Height of the entire drawing. */
  height: number;

  /** Path to the selected node (if any). It will be drawn differently. */
  selected?: Path;

  /** Called with the full path to the square the user clicked on. */
  onClick?: (path: Path) => void;
};


/**
 * Returns an HTML TD element that draws the given square.
 * @param prop object with the square, width, and height
 * @return TD element with the given width and pattern described in square
 */
export function SquareElem(props: SquareProps): JSX.Element {
  return (
    <table cellPadding={0} cellSpacing={0}>
      <tbody>
        <tr>
          <SquareNodeElem square={props.square} onClick={props.onClick}
              width={props.width} height={props.height} path={nil}
              selected={props.selected ? rev(props.selected) : undefined}/>
        </tr>
      </tbody>
    </table>);
}


interface SquareNodeProps extends SquareProps {
  path: Path;          // path to the current node (reversed!)
  revSelected?: Path;  // selected path in reversed order
}


// Creates one node in the tree and everything below it.
export function SquareNodeElem(props: SquareNodeProps): JSX.Element {
  const clickHandler = (!props.onClick) ? ignoreClick :
      (evt: any) => {
        evt.stopPropagation();
        props.onClick!(rev(props.path));
      };

  if (props.square.kind === "solid") {
    let cls = props.square.color;
    if (props.selected && equals(props.path, props.selected))
      cls += '-selected';
    const w = props.width + 'px';
    const h = props.height + 'px';
    return <td className={'square-solid ' + cls} style={{width: w, height: h}}
               onClick={clickHandler}> </td>;
  } else {
    let cls = "square-split";
    const left = Math.floor(props.width / 2);
    const right = Math.ceil(props.width / 2);
    const top = Math.floor(props.height / 2);
    const bottom = Math.ceil(props.height / 2);
    return (
      <td className={cls}>
        <table cellSpacing={0}>
        <tbody>
          <tr>
            <SquareNodeElem square={props.square.nw} width={left} height={top}
                path={cons("NW", props.path)} onClick={props.onClick}
                selected={props.selected}/>
            <SquareNodeElem square={props.square.ne} width={right} height={top}
                path={cons("NE", props.path)} onClick={props.onClick}
                selected={props.selected}/>
          </tr>
          <tr>
            <SquareNodeElem square={props.square.sw} width={left} height={bottom}
                path={cons("SW", props.path)} onClick={props.onClick}
                selected={props.selected}/>
            <SquareNodeElem square={props.square.se} width={right} height={bottom}
                path={cons("SE", props.path)} onClick={props.onClick}
                selected={props.selected}/>
          </tr>
        </tbody>
        </table>
      </td>);
  }
}


// Dummy function to use if the user doesn't provide onClick.
// Exporting this so the tests can use it.
export const ignoreClick = () => {};
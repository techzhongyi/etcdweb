import React, { useRef, useEffect } from 'react';
import 'react-diff-view/style/index.css';
import { Diff } from 'react-diff-view/esm';
import {
  parseDiff,
  Hunk,
  Decoration,
  tokenize,
  markEdits,
} from 'react-diff-view';
import { diffLines, formatLines } from 'unidiff';
import refractor from 'refractor';

const Appdiff: React.FC = (props) => {
  const { oldVal, newVal } = props;
  //比较新值和旧值的方法
  const diffText = formatLines(diffLines(oldVal, newVal), {
    context: 3,
  });
  const files = parseDiff(diffText, { nearbySequences: 'zip' });
  const renderFile = ({
    //@ts-ignore
    oldRevision, //@ts-ignore
    newRevision, //@ts-ignore
    type, //@ts-ignore
    hunks,
  }) => {
    //不一样的地方用高亮表示
    const options = {
      highlight: false,
      // refractor,
      // language: 'jsx',
      enhancers: [markEdits(hunks, { type: 'block' })],
    };

    const token = tokenize(hunks, options);
    return (
      <div key={oldRevision + '-' + newRevision} className="file-diff">
        {/* split就是分左右两个区域做对比 */}
        <Diff viewType="split" diffType={type} hunks={hunks} tokens={token}>
          {/* @ts-ignore */}
          {(hunks) =>
            hunks.map((hunk: { content: {} | null | undefined }) => [
              // 作用未知
              // <Decoration key={"deco-" + hunk.content}>
              //   <div className="hunk-header">{hunk.content}</div>
              // </Decoration>,
              //这里是核心的渲染区
              <Hunk key={hunk.content} hunk={hunk} />,
            ])
          }
        </Diff>
      </div>
    );
  };
  return <div>{files.map(renderFile)}</div>;
};

export default Appdiff;

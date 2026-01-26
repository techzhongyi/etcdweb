import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Spin, message } from 'antd';
import { history } from 'umi';
import yaml from 'js-yaml';
import type { EditorFromTextArea, Position } from 'codemirror';
import EtdcHeader from '@/components/NewHeader';
import DisableCodeMirror from '@/components/DisableCodeMirror';
import { getApiDocDetailAPI } from '@/services/apidoc';
import './index.less';

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const editorRef = useRef<EditorFromTextArea | null>(null);
  const matchesRef = useRef<Array<{ from: Position; to: Position }>>([]);
  const marksRef = useRef<{ base: any[]; active: any | null }>({
    base: [],
    active: null,
  });
  const query = history?.location?.query || {};
  const { organize, uri, updtime } = query as {
    organize?: string;
    uri?: string;
    updtime?: string;
  };

  const loadDetail = async () => {
    if (!organize || !uri || !updtime) {
      message.warning('缺少必要参数');
      return;
    }
    setLoading(true);
    const { data } = await getApiDocDetailAPI({ organize, uri, updtime });
    setDetail(data?.item || data?.detail || data);
    setLoading(false);
  };

  useEffect(() => {
    loadDetail();
  }, []);

  const clearSearchMarks = () => {
    marksRef.current.base.forEach((mark) => mark.clear());
    marksRef.current.base = [];
    if (marksRef.current.active) {
      marksRef.current.active.clear();
      marksRef.current.active = null;
    }
  };

  const applySearchMarks = (matches: Array<{ from: Position; to: Position }>) => {
    const editor = editorRef.current;
    if (!editor) return;
    clearSearchMarks();
    editor.operation(() => {
      marksRef.current.base = matches.map((match) =>
        editor
          .getDoc()
          .markText(match.from, match.to, { className: 'api-doc-detail-search-highlight' }),
      );
      if (matches.length > 0) {
        const active = matches[activeMatchIndex] || matches[0];
        marksRef.current.active = editor
          .getDoc()
          .markText(active.from, active.to, {
            className: 'api-doc-detail-search-highlight-active',
          });
        editor.scrollIntoView({ from: active.from, to: active.to }, 80);
      }
    });
  };

  const runSearch = (value: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    clearSearchMarks();
    if (!value) {
      matchesRef.current = [];
      setMatchCount(0);
      setActiveMatchIndex(0);
      return;
    }
    const doc = editor.getDoc();
    const source = doc.getValue();
    const needle = value.trim();
    if (!needle) {
      matchesRef.current = [];
      setMatchCount(0);
      setActiveMatchIndex(0);
      return;
    }
    const sourceLower = source.toLowerCase();
    const needleLower = needle.toLowerCase();
    const matches: Array<{ from: Position; to: Position }> = [];
    let startIndex = 0;
    while (startIndex <= sourceLower.length) {
      const index = sourceLower.indexOf(needleLower, startIndex);
      if (index === -1) break;
      const from = doc.posFromIndex(index);
      const to = doc.posFromIndex(index + needleLower.length);
      matches.push({ from, to });
      startIndex = index + needleLower.length;
    }
    matchesRef.current = matches;
    setMatchCount(matches.length);
    setActiveMatchIndex(matches.length > 0 ? 0 : 0);
    applySearchMarks(matches);
  };

  useEffect(() => {
    const timer = setTimeout(() => runSearch(searchText), 200);
    return () => clearTimeout(timer);
  }, [searchText, detail]);

  useEffect(() => {
    if (matchesRef.current.length === 0) return;
    applySearchMarks(matchesRef.current);
  }, [activeMatchIndex]);

  const goToMatch = (direction: 'next' | 'prev') => {
    const matches = matchesRef.current;
    if (matches.length === 0) return;
    setActiveMatchIndex((prev) => {
      if (direction === 'next') {
        return (prev + 1) % matches.length;
      }
      return (prev - 1 + matches.length) % matches.length;
    });
  };

  const formatYamlContent = (value: unknown) => {
    if (value === null || value === undefined) {
      return '';
    }
    const normalizeInput = (input: string) =>
      input
        .replace(/\\n/g, '\n')
        .replace(/\\r\\n/g, '\n')
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, '  ');
    try {
      const parsed =
        typeof value === 'string' ? yaml.load(normalizeInput(value)) : value;
      if (parsed === undefined || parsed === null) {
        return typeof value === 'string' ? value : '';
      }
      const dumped = yaml.dump(parsed, {
        indent: 2,
        lineWidth: 120,
        noRefs: true,
        sortKeys: false,
      });
      return formatInlineYaml(dumped);
    } catch (error) {
      return typeof value === 'string' ? value : '';
    }
  };

  const formatInlineYaml = (input: string) => {
    const lines = input.split('\n');
    const output: string[] = [];
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const lineMatch = line.match(/^(\s*)(["']?[\w$.-]+["']?):$/);
      if (lineMatch) {
        const indent = lineMatch[1];
        const rawKey = lineMatch[2];
        const unquotedKeyMatch = rawKey.match(/^["'](.+)["']$/);
        const key = unquotedKeyMatch ? unquotedKeyMatch[1] : rawKey;
        const childIndent = `${indent}  `;
        const next = lines[i + 1];
        const next2 = lines[i + 2];

        if (
          key === '$tableSearch' ||
          key === 'tableSearch' ||
          key === '$tableLimit' ||
          key === 'tableLimit' ||
          key === '$tableSort' ||
          key === 'tableSort'
        ) {
          const entries: { key: string; value?: string }[] = [];
          let j = i + 1;
          let hasNested = false;
          while (j < lines.length) {
            const childLine = lines[j];
            if (!childLine.startsWith(childIndent)) break;
            if (childLine.startsWith(`${childIndent}- `)) {
              hasNested = true;
              break;
            }
            if (childLine.startsWith(`${childIndent}  `)) {
              hasNested = true;
              break;
            }
            const kvMatch = childLine.match(
              new RegExp(`^${childIndent}([\\w$-]+):(.*)$`),
            );
            if (kvMatch) {
              const entryKey = kvMatch[1];
              const rawValue = kvMatch[2].trim();
              entries.push({
                key: entryKey,
                value:
                  rawValue && rawValue !== 'null' && rawValue !== '~'
                    ? rawValue
                    : undefined,
              });
              j += 1;
              continue;
            }
            const flagMatch = childLine.match(
              new RegExp(`^${childIndent}([\\w$-]+)$`),
            );
            if (flagMatch) {
              entries.push({ key: flagMatch[1] });
              j += 1;
              continue;
            }
            break;
          }
          const entryKeys = entries.map((item) => item.key);
          const allowedKeysMap: Record<string, string[]> = {
            $tableSearch: ['type', 'desc', 'search'],
            tableSearch: ['type', 'desc', 'search'],
            $tableLimit: ['type', 'desc', 'page', 'count'],
            tableLimit: ['type', 'desc', 'page', 'count'],
            $tableSort: ['type', 'desc', 'sort'],
            tableSort: ['type', 'desc', 'sort'],
          };
          const allowedKeys = allowedKeysMap[key] || [];
          if (
            !hasNested &&
            entries.length > 0 &&
            entryKeys.every((item) => allowedKeys.includes(item)) &&
            entryKeys.includes('type') &&
            entryKeys.includes('desc')
          ) {
            const typeValue = entries.find((item) => item.key === 'type')?.value;
            const descValue = entries.find((item) => item.key === 'desc')?.value;
            const searchValue = entries.find((item) => item.key === 'search')?.value;
            const pageValue = entries.find((item) => item.key === 'page')?.value;
            const countValue = entries.find((item) => item.key === 'count')?.value;
            const sortValue = entries.find((item) => item.key === 'sort')?.value;
            const parts: string[] = [];
            if (typeValue) {
              parts.push(`type: ${typeValue}`);
            }
            if (descValue) {
              parts.push(`desc: ${descValue}`);
            }
            if (entryKeys.includes('search')) {
              parts.push(searchValue ? `search: ${searchValue}` : 'search');
            }
            if (entryKeys.includes('page')) {
              parts.push(pageValue ? `page: ${pageValue}` : 'page');
            }
            if (entryKeys.includes('count')) {
              parts.push(countValue ? `count: ${countValue}` : 'count');
            }
            if (entryKeys.includes('sort')) {
              parts.push(sortValue ? `sort: ${sortValue}` : 'sort');
            }
            if (parts.length > 0) {
              output.push(`${indent}${key}: { ${parts.join(', ')} }`);
              i = j - 1;
              continue;
            }
          }
        }

        const typeMatch = next?.match(new RegExp(`^${childIndent}type: (.+)$`));
        const descMatch = next2?.match(new RegExp(`^${childIndent}desc: (.+)$`));
        const next3 = lines[i + 3];
        if (
          typeMatch &&
          descMatch &&
          (!next3 || !next3.startsWith(childIndent))
        ) {
          output.push(
            `${indent}${key}: { type: ${typeMatch[1]}, desc: ${descMatch[1]} }`,
          );
          i += 2;
          continue;
        }

        if (key === 'required' && next?.startsWith(`${childIndent}- `)) {
          const items: string[] = [];
          let j = i + 1;
          while (j < lines.length) {
            const itemMatch = lines[j].match(new RegExp(`^${childIndent}- (.+)$`));
            if (!itemMatch) break;
            items.push(itemMatch[1]);
            j += 1;
          }
          if (items.length > 0) {
            output.push(`${indent}${key}: [${items.join(', ')}]`);
            i = j - 1;
            continue;
          }
        }

        if (key === 'Auth' && next?.startsWith(`${childIndent}- `)) {
          const items: string[] = [];
          let j = i + 1;
          while (j < lines.length) {
            const itemMatch = lines[j].match(new RegExp(`^${childIndent}- (.+)$`));
            if (!itemMatch) break;
            items.push(itemMatch[1]);
            j += 1;
          }
          if (items.length > 0) {
            output.push(`${indent}${key}: [ ${items.join(', ')} ]`);
            i = j - 1;
            continue;
          }
        }

        const seqItemMatch = next?.match(new RegExp(`^${childIndent}- (.+)$`));
        if (seqItemMatch && (!next2 || !next2.startsWith(childIndent))) {
          output.push(`${indent}${key}: [${seqItemMatch[1]}]`);
          i += 1;
          continue;
        }
      }

      output.push(line);
    }
    return output.join('\n');
  };

  const contentValue = useMemo(() => {
    if (!detail) {
      return '';
    }
    if (typeof detail === 'string') {
      return formatYamlContent(detail);
    }
    if (detail?.content && typeof detail.content === 'string') {
      return formatYamlContent(detail.content);
    }
    return formatYamlContent(detail);
  }, [detail]);

  const renderContent = () => {
    if (!detail) {
      return <div className="api-doc-detail-empty">暂无内容</div>;
    }
    return (
      <div className="api-doc-detail-codemirror">
        <DisableCodeMirror
          value={contentValue}
          language="yaml"
          height={600}
          onChange={() => {}}
          onReady={(editor) => {
            editorRef.current = editor;
            runSearch(searchText);
          }}
        />
      </div>
    );
  };

  return (
    <div className="api-doc-detail-page">
      <EtdcHeader />
      <div className="api-doc-detail-content">
        <div className="api-doc-detail-header">
          <div className="api-doc-detail-title">文档详情</div>
          <Button onClick={() => history.goBack()}>返回</Button>
        </div>
        <div className="api-doc-detail-meta">
          <div>组织：{organize || '-'}</div>
          <div>URI：{uri || '-'}</div>
          <div>更新时间：{updtime || '-'}</div>
        </div>
        <div className="api-doc-detail-search">
          <Input
            placeholder="搜索字段"
            allowClear
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <Button
            onClick={() => goToMatch('prev')}
            disabled={!matchCount}
          >
            上一个
          </Button>
          <Button
            onClick={() => goToMatch('next')}
            disabled={!matchCount}
          >
            下一个
          </Button>
          <span className="api-doc-detail-search-count">
            {matchCount ? `${activeMatchIndex + 1}/${matchCount}` : '0/0'}
          </span>
        </div>
        <Spin spinning={loading}>
          <div className="api-doc-detail-body">{renderContent()}</div>
        </Spin>
      </div>
    </div>
  );
};

export default Index;

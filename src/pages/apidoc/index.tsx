import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, List, Pagination, Select, Spin } from 'antd';
import './index.less';
import EtdcHeader from '@/components/NewHeader';
import {
  getApiDocListAPI,
  getApiDocOrganizationListAPI,
  getApiDocProjectListAPI,
} from '@/services/apidoc';
import { history } from 'umi';

const Index: React.FC = () => {
  const [versionList, setVersionList] = useState<string[]>([]);
  const [activeVersion, setActiveVersion] = useState<string>('');
  const [organizeList, setOrganizeList] = useState<string[]>([]);
  const [activeOrganize, setActiveOrganize] = useState<string>('');
  const [docList, setDocList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ author: '', desc: '' });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const versionKeyMap = useMemo(() => {
    const map = new Map<string, string>();
    versionList.forEach((item) => {
      map.set(item, item);
    });
    return map;
  }, [versionList]);

  const loadOrganizeList = async () => {
    const { data } = await getApiDocOrganizationListAPI({});
    const items = data?.items || data?.list || [];
    setOrganizeList(items);
    if (items.length > 0) {
      setActiveOrganize(items[0]);
    }
  };

  const loadVersionList = async (organizeValue = activeOrganize) => {
    if (!organizeValue) {
      setVersionList([]);
      setActiveVersion('');
      return;
    }
    const { data } = await getApiDocProjectListAPI({ organize: organizeValue });
    const items = data?.items || data?.list || [];
    setVersionList(items);
    if (items.length > 0) {
      setActiveVersion(items[0]);
    } else {
      setActiveVersion('');
    }
  };

  const loadDocList = async (page = pagination.current, pageSize = pagination.pageSize) => {
    const proj = activeVersion || versionList[0];
    if (!proj || !activeOrganize) {
      setDocList([]);
      return;
    }
    setLoading(true);
    const params = {
      organize: activeOrganize,
      proj,
      editor: filters.author,
      desc: filters.desc,
      page,
      pageSize,
    };
    const { data } = await getApiDocListAPI(params);
    const items = data?.items || data?.list || data?.records || [];
    const total = data?.total || data?.count || items.length;
    setDocList(items);
    setPagination({ current: page, pageSize, total });
    setLoading(false);
  };

  useEffect(() => {
    loadOrganizeList();
  }, []);

  useEffect(() => {
    if (activeOrganize) {
      loadVersionList(activeOrganize);
    }
  }, [activeOrganize]);

  useEffect(() => {
    if (activeVersion && activeOrganize) {
      loadDocList(1, pagination.pageSize);
    }
  }, [activeVersion, activeOrganize]);

  const onSearch = () => {
    loadDocList(1, pagination.pageSize);
  };

  const onReset = () => {
    setFilters({ author: '', desc: '' });
    setPagination((prev) => ({ ...prev, current: 1 }));
    setTimeout(() => loadDocList(1, pagination.pageSize), 0);
  };

  const openDocDetail = (item: any) => {
    if (!activeOrganize || !item?.uri || !item?.updtime) {
      return;
    }
    history.push({
      pathname: '/apidoc/detail',
      query: {
        organize: activeOrganize,
        uri: item.uri,
        updtime: item.updtime,
      },
    });
  };

  return (
    <div className="api-doc-page">
      <EtdcHeader />
      <div className="api-doc-content">
        <div className="api-doc-search">
          <Select
            value={activeOrganize || undefined}
            placeholder="组织"
            onChange={(value) => setActiveOrganize(value)}
            options={organizeList.map((item) => ({ label: item, value: item }))}
          />
          <Input
            value={filters.author}
            placeholder="作者"
            allowClear
            onChange={(e) => setFilters((prev) => ({ ...prev, author: e.target.value }))}
          />
          <Input
            value={filters.desc}
            placeholder="描述"
            allowClear
            onChange={(e) => setFilters((prev) => ({ ...prev, desc: e.target.value }))}
          />
          <Button type="primary" onClick={onSearch}>
            搜索
          </Button>
          <Button onClick={onReset}>重置</Button>
        </div>

        <div className="api-doc-body">
          <div className="api-doc-version-list">
            <div className="api-doc-panel-title">版本列表</div>
            <List
              dataSource={versionList}
              renderItem={(item) => {
                const isActive = activeVersion === item;
                return (
                  <div
                    className={`api-doc-version-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveVersion(item)}
                  >
                    {item}
                  </div>
                );
              }}
            />
          </div>

          <div className="api-doc-doc-list">
            <div className="api-doc-panel-title">
              文档列表
              <span className="api-doc-panel-subtitle">
                {activeVersion ? versionKeyMap.get(activeVersion) : ''}
              </span>
            </div>
            <div className="api-doc-doc-header">
              <div className="col-uri">URI</div>
              <div className="col-desc">描述</div>
              <div className="col-editor">编辑者</div>
              <div className="col-updtime">更新时间</div>
            </div>
            <Spin spinning={loading}>
              <div className="api-doc-doc-rows">
                {docList.length === 0 ? (
                  <div className="api-doc-empty">暂无数据</div>
                ) : (
                  docList.map((item, index) => (
                    <div className="api-doc-doc-row" key={item?.id || item?.uri || index}>
                      <div className="col-uri">
                        {item?.uri ? (
                          <a className="api-doc-uri-link" onClick={() => openDocDetail(item)}>
                            {item.uri}
                          </a>
                        ) : (
                          '-'
                        )}
                      </div>
                      <div className="col-desc">{item?.desc || '-'}</div>
                      <div className="col-editor">{item?.editor || '-'}</div>
                      <div className="col-updtime">{item?.updtime || '-'}</div>
                    </div>
                  ))
                )}
              </div>
            </Spin>
            <div className="api-doc-pagination">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger
                onChange={(page, pageSize) => loadDocList(page, pageSize)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

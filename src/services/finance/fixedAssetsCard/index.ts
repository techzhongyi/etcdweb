import request from '@/utils/request';

/** 获取应收列表 GET /finance/fixed_assets */
export async function getFixedAssetsList(options: any) {
  return request('/finance/fixed_assets', {
    method: 'GET',
    params: options,
  });
}

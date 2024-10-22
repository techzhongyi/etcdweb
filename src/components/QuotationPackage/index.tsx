import { Button, Modal, Space } from 'antd';
import ProForm, {
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';
import Help from '@/utils/help';

const QuotationPackageModal = (props: any) => {
  const { isModalVisible, close, onFinish } = props;
  const workType = [
    {
      value: 5,
      label: '人月',
    },
    {
      value: 6,
      label: '人天',
    },
    {
      value: 7,
      label: '其他',
    },
    {
      value: 8,
      label: '系统',
    },
  ];

  return (
    <Modal
      title="新增报价"
      footer={null}
      open={isModalVisible}
      onCancel={close}
    >
      <ProForm
        submitter={{
          render: (props, dom) => (
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={close}>取消</Button>
                <Button
                  type="primary"
                  key="submit"
                  onClick={() => props.form?.submit?.()}
                >
                  提交
                </Button>
              </Space>
            </div>
          ),
        }}
        onFinish={onFinish}
      >
        <ProFormDigit
          width="md"
          name="total_price"
          label="金额"
          placeholder="请输入金额"
          fieldProps={{
            maxLength: 10,
          }}
          rules={[
            {
              required: true,
              message: '请输入金额!',
            },
            {
              pattern: Help.Regular.number.intege_lose,
              message: '请输入正确的金额',
            },
          ]}
        />
        <ProFormSelect
          options={workType}
          width="md"
          name="type"
          label="类型"
          rules={[
            {
              required: true,
              message: '请选择类型！',
            },
          ]}
        />
        <ProFormTextArea
          name="remarks"
          label="备注"
          width="md"
          fieldProps={{
            maxLength: 499,
          }}
          tooltip="填写说明：
          1.报价单位为人天时，请备注报价所包含的“人员级别*数量”，人员级别指初级、中级、高级等（人员级别请参考面试定级）；
          2.报价单位为人月时，请备注报价所包含的“人员级别*数量”，人员级别指初级、中级、高级等（人员级别请参考面试定级）；
          3.报价单位为系统时，请备注报价所包含的“备案地区-系统级别*数量”，系统级别指一级、二级、三级、四级。
          备注：“人员级别”、“备案地区”、“系统级别”不同时，请分行填写。"
          placeholder="请填写备注"
          rules={[
            {
              required: true,
              message: '请填写备注！',
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};
export default QuotationPackageModal;

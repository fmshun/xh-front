import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Modal, InputNumber, message } from 'antd';
import useSetState from '../../../../lib/use-set-state';
import { addJobInfo, updateJobInfo, getContactSelect } from '../server';
import List from './list';
import { filterObject } from '../../../../lib/util'
import { settlementTypes, genderLimits } from '../enum';

const { TextArea } = Input;

const { Option } = Select;

const settlementTypeOptions = Object.entries(settlementTypes).map(([k, v]) => {
    return {
        id: +k,
        value: +k,
        title: v,
    };
});

const genderLimitOptions = Object.entries(genderLimits).map(([k, v]) => {
    return {
        id: +k,
        value: +k,
        title: v
    };
});

const emptyJob = {
    title: '',
    jobPrice: '',
    priceUnit: '',
    settlementType: 3,
    genderLimit: 0,
    limitNum: 0,
    description: '',
    notice: '',
    contactId: null,
};

const validEmpty = (param) => {
    const {
        title,
        jobPrice,
        priceUnit,
        settlementType,
        limitNum,
        description,
        notice,
        contactId,
    } = param;
    return !(!title || !jobPrice || !priceUnit || !limitNum || !description || !notice || !contactId || !settlementType);
}

function Handle(props) {
    const { listData } = props;
    const [ fInfo, setFInfo ] = useSetState({
        contactList: [],
    });
    const [ addInfo, setAddInfo, initAddInfo ] = useSetState(Object.assign({}, emptyJob, {
        visible: false
    }));
    const editor = (info) => {
        initAddInfo(Object.assign({}, info, {
            visible: true,
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            const r = await getContactSelect();
            if (r.code === 0) {
                console.log(r.info);
                setFInfo(r.info);
            } else {
                Modal.error({
                    title: r.msg,
                });
            }
        };
        fetchData();
    }, []);
    return (
        <div>
            <div className="handle-box">
                <Button
                    type="primary"
                    onClick={() => {
                        initAddInfo({ visible: true });
                    }}
                >
                    ??????
                </Button>
                <div className="row-info">
                    ??????{listData.total}?????????
                </div>
            </div>
            <List listData={listData} editor={editor} />
            <Modal
                title={addInfo.jobId ? '??????' : '??????'}
                visible={addInfo.visible}
                okText="??????"
                cancelText="??????"
                maskClosable={false}
                onOk={async () => {
                    if (validEmpty(addInfo)) {
                        console.log(addInfo);
                        let postData = addJobInfo;
                        const arr = Object.keys(emptyJob);
                        if (addInfo.jobId) {
                            postData = updateJobInfo;
                            arr.push('jobId');
                        }
                        const param = filterObject(addInfo, arr);
                        // todo: ????????????
                        const r = await postData(param);
                        if (r && r.code === 0) {
                            initAddInfo();
                            message.success('????????????');
                            document.querySelector('.search-button').click();
                        } else {
                            Modal.error({
                                title: r.msg,
                            });
                        }
                    } else {
                        Modal.error({
                            title: '??????????????????'
                        });
                    }
                }}
                onCancel={() => initAddInfo({ visible: false })}
            >
                <Form
                    preserve={false}
                    labelAlign="right"
                    labelCol={{ span: 5 }}
                    style={{ height: 400, overflow: 'auto' }}
                >
                    <Form.Item
                        label="??????"
                    >
                        <Input
                            style={{ width: 320 }}
                            value={addInfo.title}
                            onChange={(e) => {
                                setAddInfo({ title: e.target.value });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="??????"
                    >
                        <Input
                            style={{ width: 320 }}
                            value={addInfo.jobPrice}
                            onChange={(e) => {
                                setAddInfo({ jobPrice: e.target.value });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="??????"
                    >
                        <Input
                            style={{ width: 320 }}
                            value={addInfo.priceUnit}
                            onChange={(e) => {
                                setAddInfo({ priceUnit: e.target.value });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                    >
                        <Select
                            style={{ width: 320 }}
                            value={addInfo.settlementType}
                            onChange={(v) => {
                                setAddInfo({ settlementType: v });
                            }}
                        >
                            {
                                settlementTypeOptions.map(v => (
                                    <Option key={v.id} value={v.value}>{v.title}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                    >
                        <Select
                            style={{ width: 320 }}
                            value={addInfo.genderLimit}
                            onChange={(v) => {
                                setAddInfo({ genderLimit: v });
                            }}
                        >
                            {
                                genderLimitOptions.map(v => (
                                    <Option key={v.id} value={v.value}>{v.title}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                    >
                        <InputNumber
                            style={{ width: 320 }}
                            value={addInfo.limitNum}
                            onChange={(e) => {
                                setAddInfo({ limitNum: e });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                    >
                        <TextArea
                            style={{ width: 320 }}
                            value={addInfo.description}
                            autoSize={{
                                minRows: 5,
                            }}
                            onChange={(e) => {
                                setAddInfo({ description: e.target.value });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="????????????"
                    >
                        <TextArea
                            style={{ width: 320 }}
                            value={addInfo.notice}
                            autoSize={{
                                minRows: 3,
                            }}
                            onChange={(e) => {
                                setAddInfo({ notice: e.target.value });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="???????????????"
                    >
                        <Select
                            style={{ width: 320 }}
                            value={addInfo.contactId}
                            onChange={(v) => {
                                setAddInfo({ contactId: v });
                            }}
                        >
                            {
                                fInfo.contactList.map(v => (
                                    <Option key={v.contactId} value={v.contactId} >
                                        {v.contactName}   {v.contactPhoneNumber}
                                    </Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Handle;

Ext.define ('App.views.user.UsersGrid', {
    extend: 'App.views.commons.Grid',
    paging: true,
    selModel: Ext.create('Ext.selection.CheckboxModel', {
        mode: 'MULTI'
    }),
    store: Store.create({
        autoLoad: true,
        pageSize: 99,
        url: 'user/list',
        fields: ['id', 'name', 'gender']
    }),
    columns: [{
        xtype: 'rownumberer'
    },{
        dataIndex: 'name',
        text: '名称',
        flex: 1
    },{
        dataIndex: 'gender',
        text: '性别',
        width: 32
    }],
    tbar: [{
    	text: '添加',
        icon: 'assets/commons/images/add.gif',
        handler: function (btn) {
            var g = btn.up('grid'),
                // 创建用户对话框
                w = g.user_dlg('新建用户', function (btn_save) { // 保存回调
                    var dlg = btn_save.up('window'),
                        v = dlg.down('form').getValues();
                    Ajax.save('user/newUser', {
                        user: v
                    }, function (id) {
                        v.id = id;
                        // 插入到第一条
                        g.getStore().insert(0, v);
                        // 刷新视图
                        g.getView().refresh();
                        // 关闭对话框
                        dlg.close();
                        Message.alert('添加成功！');
                    })
                });
            w.show();
        }
    }, {
    	text: '编辑',
        icon: 'assets/commons/images/edit.png',
        handler: function (btn) {
            var g = btn.up('grid'),
                user = g.getSelectionModel().getLastSelected(),
                // 创建用户对话框
                w = g.user_dlg('编辑用户', function (btn_save) { // 保存回调
                    var dlg = btn_save.up('window'),
                        v = dlg.down('form').getValues();
                    Ajax.save('user/update', {
                        user: v,
                        // 更新条件
                        where: {
                            id: user.get('id')
                        }
                    }, function () {
                        // 修改record值
                        user.set(v);
                        // 提交修改
                        user.commit();
                        // 关闭对话框
                        dlg.close();
                        Message.alert('更新成功！');
                    })
                });
            // 设置form值
            w.down('form').getForm().setValues(user.getData());
            w.show();
        }
    }, {
    	text: '删除',
        icon: 'assets/commons/images/delete.gif',
        handler: function (btn) {
            var g = btn.up('grid'),
                ss = g.getSelectionModel().getSelection(),
                i,
                ids;
            if (ss.length) {
                Dialog.confirm('确认要删除选中记录么？', function () {
                    ids = [];
                    // 收集选中行编号
                    for (i = 0; i < ss.length; ++i) {
                        ids.push(ss[i].get('id'));
                    }
                    Ajax.post('user/delete', {
                        ids: ids
                    }, function () {
                        // 移除记录
                        g.getStore().remove(ss);
                        // 刷新视图
                        g.getView().refresh();
                        Message.alert('删除成功！');
                    });
                });

            } else {
                Message.warn('请选择要删除的记录！');
            }
        }
    }],
    user_dlg: function (title, fn_save) {
        return Ext.widget('window', {
            title: title,
            modal: true,
            width: 320,
            layout: 'fit',
            items: {
                xtype: 'form',
                border: false,
                layout: 'anchor',
                bodyPadding: 12,
                defaults: {
                    anchor: '96%',
                    labelWidth: 36
                },
                items: [{
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: '姓名'
                }, {
                    xtype: 'combo',
                    store: [['M', '男'], ['F', '女']],
                    editable: false,
                    value: 'M', // 默认选项
                    name: 'gender',
                    fieldLabel: '性别'
                }]
            },
            buttons: [{
                text: '确定',
                icon: 'assets/commons/images/okay.png',
                handler: fn_save
            }, {
                text: '取消',
                icon: 'assets/commons/images/close.png',
                handler: function (btn) {
                    btn.up('window').close();
                }
            }]
        });
    }
});

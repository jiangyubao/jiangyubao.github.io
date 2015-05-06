Ext.application({
    title: 'Web 2.0 Summit 2010',
    launch: function () {
        Ext.create('Ext.Container', {
                layout: {
                    type: 'hbox',
                    align: 'start',
                    pack: 'start'
                },
                items: [
                    {
                        xtype: 'component',
                        html: 'width: 150',
                        width: 150
                    }, {
                        xtype: 'component',
                        html: 'width: 150',
                        width: 150
                    }
                ]
            }
        );
    }
});

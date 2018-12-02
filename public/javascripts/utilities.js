function showDeleteModal(objectType, objectID, objectName) {


    // Modal base
    let modalBase =
        $('<div>', {
            id:         'modalDelete_' + objectID,
            class:      'modal',
            tabindex:   -1,
            role:       'dialog'
        })
        .append(
            $('<div>', {
                class:  'modal-dialog',
                role:   'document'
            })
            .append(
                $('<div>', {
                    class:  'modal-content'
                })
            )
        );


    // Modal header
    let modalHeader = $('<div>', {
        class:  'modal-header',
    });

    let objectTypeUpper = objectType.charAt(0).toUpperCase() + objectType.slice(1);

    modalHeader
        .append(
            $('<h5>', {
                class:  'modal-title'
            })
            .text(`Delete ${objectTypeUpper}: ${objectID}`)
        );

    modalHeader
        .append(
            $('<button>', {
                type:           'button',
                class:          'close',
                'data-dismiss': 'modal',
                'aria-label':   'Close'
            })
        )
        .append(
            $('<span>', {
               'aria-hidden':  'true'
            })
            .html('&times;')
        );

    modalBase.find('.modal-content').append(modalHeader);


    // Modal body
    let modalBody =
        $('<div>', {
            class:  'modal-body'
        }).append(
            $('<p>').text(`Are you sure you want to delete the following ${objectType}?`)
        );

    let modalBodyTable = 
        $('<table>', {
            class:  'table'
        });
    modalBodyTable
        .append(
            $('<tbody>')
                .append(
                    $('<tr>')
                        .append(
                            $('<th>').text('Type'),
                            $('<td>').text(objectType)
                        ),
                    $('<tr>')
                        .append(
                            $('<th>').text('ID'),
                            $('<td>').text(objectID)
                        ),
                    $('<tr>')
                        .append(
                            $('<th>').text('Name'),
                            $('<td>').text(objectName)
                        )
                )
        );
    modalBody.append(modalBodyTable);

    modalBase.find('.modal-content').append(modalBody);


    // Modal footer
    let modalFooter =
        $('<div>', {
            class:  'modal-footer'
        });
    modalFooter
        .append(
            $('<button>', {
                id:                 'modalDeleteConfirm_' + objectID,
                type:               'button',
                class:              'btn btn-primary',
                'data-objecttype':  objectType,
                'data-objectid':    objectID
            }).text('Delete')
        );

    modalFooter
        .find('#modalDeleteConfirm_' + objectID)
        .after(
            $('<button>', {
                type:               'button',
                class:              'btn btn-secondary',
                'data-dismiss':     'modal'
            }).text('Close')
        );
    
    modalBase.find('.modal-content').append(modalFooter);

    // Add to body
    $('body').append(modalBase);
    $('#modalDelete_' + objectID).modal('show');

    // Event handlers
    $('#modalDelete_' + objectID).on('hidden.bs.modal', function() {
        $(this).remove();
    });

    $('#modalDeleteConfirm_' + objectID).on('click', function() {
        let targetID = $(this).data('objectid');
        let targetType=  $(this).data('objecttype');

        $.ajax({
            method:     'POST',
            url:        `${window.location.origin}/inventory/${targetType}/${targetID}/delete`,
            dataType:   'json',
            data:       {
                id:     targetID,
                type:   targetType
            },
            success:    (response) => {
                console.log(response);
                if (response.hasOwnProperty('redirect')) {
                    window.location.replace(window.location.origin + response.redirect);
                }
            },
            fail:       (response) => {
                console.log(response);
            }
        });
    });

    return;
}
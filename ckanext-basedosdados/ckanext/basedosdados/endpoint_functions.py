import ckan.lib.plugins as lib_plugins
import ckan.logic as logic
import logging
log = logging.getLogger(__name__)
ValidationError = logic.ValidationError

def package_validate(context, data_dict):
    model = context['model']
    context['ignore_auth'] = True
    if 'type' not in data_dict:
        package_plugin = lib_plugins.lookup_package_plugin()
        try:
            # use first type as default if user didn't provide type
            package_type = package_plugin.package_types()[0]
        except (AttributeError, IndexError):
            package_type = 'dataset'
            # in case a 'dataset' plugin was registered w/o fallback
        data_dict['type'] = package_type
    package_plugin = lib_plugins.lookup_package_plugin(data_dict['type'])

    schema = context.get('schema') or package_plugin.create_package_schema()
    # _check_access('package_create', context, data_dict)
    data, errors = lib_plugins.plugin_validate(
        package_plugin, context, data_dict, schema, 'package_create')
    log.debug('package_create validate_errs=%r user=%s package=%s data=%r',
              errors, context.get('user'),
              data.get('name'), data_dict)
    if errors:
        raise ValidationError(errors)
    model.Session.rollback()
    return 'Ok'

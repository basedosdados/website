import collections
def create_virtual_fields(fields):
    return {name: f(fields) for name, f in CREATORS.items()}


###################################
### VIRTUAL DATASET FIELDS
###
### To create a virtual field, create a function bellow.
### The function should be called "create_{name}" where name is the virtual field you are creating
### The function will be called with a single argument, which is a dictionary of the package's existing non-virtual fields
### The function should return either a list of scalars or a scalar field (int, str, float, etc)
###################################
################################### Define virtual fields bellow this line ###################################

def create_obs_level_entity(fields): #TODO: Move this to a folder and document virtual fields
    entities = set()
    for resource in fields.get("res_extras_observation_level", []):
        if resource == None: continue
        entity = set(e.get("entity") for e in resource if "entity" in e)
        entities |= entity
    return list(entities)



################################### Define virtual fields above this line ###################################

CREATORS = {name.removeprefix('create_'): f for name, f in list(globals().items()) if
            name.startswith("create_") and name != 'create_virtual_fields' and isinstance(f, collections.Callable)}

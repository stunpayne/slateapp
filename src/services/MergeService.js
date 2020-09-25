function difference(setA, setB) {
  let _difference = new Set(setA)
  for (let elem of setB) {
      _difference.delete(elem)
  }
  return _difference;
};


export const mergeNewEventsWithOld = (old, latest) => {
  let o_keys = new Set();
  let n_keys = new Set();

  for(var i=0; i < old.length;i++){
    o_keys.add(old[i].id);
  };

  for(var i=0;i<latest.length;i++){
    n_keys.add(latest[i].id);
  };

  let diff_keys = difference(o_keys, n_keys);

  for(var i=0; i < old.length;i++){
    let item = old[i];
    if (diff_keys.has(item.id)) {
      latest.push(item);
    };
  };

  return latest;
};


export const mergeNewTasksWithOld = (old, latest) => {
  let o_keys = new Set();
  let n_keys = new Set();

  for(var i=0; i < old.length;i++){
    o_keys.add(old[i].id);
  };

  for(var i=0;i<latest.length;i++){
    n_keys.add(latest[i].id);
  };

  let diff_keys = difference(o_keys, n_keys);

  for(var i=0; i < old.length;i++){
    let item = old[i];
    if (diff_keys.has(item.id)) {
      latest.push(item);
    };
  };

  return latest;
};
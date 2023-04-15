import React from 'react';
import PropTypes from 'prop-types';
import useTreeState, {
  testData,
  findTargetNode,
  findAllTargetPathByProp,
  findTargetPathByProp,
} from 'use-tree-state';

import TreeNode from './TreeNode';
import ConfigContext from './Context';

// import './FolderTree.scss';

const FolderTree = ({
  data,
  onChange = console.log, // eslint-disable-line
  initCheckedStatus = 'unchecked',
  initOpenStatus = 'open',
  iconComponents = {},
  showCheckbox = true,
  indentPixels = 30,
  onNameClick = null,
  readOnly = false,
}) => {
  const options = {
    initCheckedStatus,
    initOpenStatus,
  };
  const { treeState, reducers } = useTreeState({ data, options, onChange });
  const { checkNode, renameNode, deleteNode, addNode, toggleOpen } = reducers;

  if (!treeState) return null;

  const configs = {
    handleCheck: checkNode,
    handleRename: renameNode,
    handleDelete: deleteNode,
    handleAddNode: addNode,
    handleToggleOpen: toggleOpen,
    onNameClick,

    iconComponents,
    indentPixels,
    showCheckbox,
    readOnly,
  };

  /* ----------
    - custom configs are passed down in context, which is same for each tree node
    - tree node specific data is passed recursively to each node, which is different for each node
                                                                                        ---------- */
  return (
    <div className="FolderTree w-full">
      <ConfigContext.Provider value={configs}>
        <TreeNode key={treeState._id} path={[]} {...treeState} />
      </ConfigContext.Provider>
    </div>
  );
};

FolderTree.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func,

  initCheckedStatus: PropTypes.string,
  initOpenStatus: PropTypes.string,
  iconComponents: PropTypes.shape({
    FileIcon: PropTypes.func,
    FolderIcon: PropTypes.func,
    FolderOpenIcon: PropTypes.func,
    EditIcon: PropTypes.func,
    DeleteIcon: PropTypes.func,
    CancelIcon: PropTypes.func,
    AddFileIcon: PropTypes.func,
    AddFolderIcon: PropTypes.func,
    CaretRightIcon: PropTypes.func,
    CaretDownIcon: PropTypes.func,
  }),
  indentPixels: PropTypes.number,
  onNameClick: PropTypes.func,
  showCheckbox: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export {
  testData,
  findTargetNode,
  findAllTargetPathByProp,
  findTargetPathByProp,
};
export default FolderTree;

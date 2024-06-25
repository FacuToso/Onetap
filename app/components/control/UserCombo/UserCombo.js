import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import * as API from 'api/API';

const UserCombo = ({ value, ignoreIds, onChange, customSelectStyles }) => {
  const [users, setUsers] = useState([]);
  const selectOptions = useMemo(() => {
    return users.map((user) => ({
      value: user.userId,
      label: user.userName,
      profileImageUrl: user.profileImageUrl,
    }));
  }, [users]);

  useEffect(() => {
    const rq = {
      ignoreIds,
    };
    API.post('/user', rq)
      .then((response) => {
        setUsers(response.data.items);
      });
  }, [ignoreIds]);

  const styles = {
    option: (styles) => ({
      ...styles,
      color: 'black',
    }),
    ...customSelectStyles,
  };

  return (
    <Select
      value={value || null}
      options={selectOptions}
      onChange={onChange}
      styles={styles}
    />
  )
};

export default UserCombo;

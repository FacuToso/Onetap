import { Tab, Tabs } from "react-bootstrap";
import classes from 'styles/custom-tabs.module.css';

const CustomTabs = ({ id, activeKey, onSelectActiveKey, tabs, fill }) => {
  return (
      <Tabs className={classes.tabs} id={id} activeKey={activeKey} onSelect={onSelectActiveKey} fill={fill}>
        {tabs.map((tab) => (
          <Tab key={tab.key} eventKey={tab.key} title={tab.title}>
            {tab.render()}
          </Tab>
        ))}
      </Tabs>
  )
};

export default CustomTabs;

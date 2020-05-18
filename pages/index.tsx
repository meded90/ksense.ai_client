import React from 'react';
import { useStores } from "../stores/stores";
import { useObserver } from "mobx-react-lite";
import { Alert, Typography } from "antd"
import TableBuilder from "../components/TableBuilder/TableBuilder";
import isServer from "../utils/isServer";

const { Title } = Typography

function Home() {

  const { projectStorageStore, settingsStore } = useStores()

  return useObserver(() => {
    return <>
      {settingsStore.projectId && settingsStore.token ? (
        <>
          <Title key={'title'}>Project storage</Title>
          <TableBuilder key={'table'} store={projectStorageStore} />
        </>
      ) : <Alert showIcon
                 type={"error"}
                 message={"Error"}
                 description={'Set projectId and token in to settings page'} />}

    </>;

  })
}

export default Home;

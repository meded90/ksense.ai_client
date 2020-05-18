import { NextPageContext } from "next";
import { Typography } from 'antd';

const { Title } = Typography

const Error = ({ statusCode }) => {
  return (
      <Title type="danger">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </Title>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

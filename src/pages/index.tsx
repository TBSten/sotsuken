import { log } from '@/gcp/firestore';
import { GetServerSideProps, NextPage } from 'next';

interface Props {
}
const Top: NextPage<Props> = ({ }) => {
  return (
    <>top</>
  );
}
export default Top;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await log()
  return {
    props: {}
  }
}
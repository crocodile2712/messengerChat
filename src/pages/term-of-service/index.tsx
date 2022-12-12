import Page from 'components/Page';
import HomeLayout from 'layouts/Home';
import Container from '@mui/material/Container';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RouteLink from 'components/RouteLink';
import HomeIcon from '@mui/icons-material/Home';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TermOfServiceMenuBar from 'components/TermOfService/MenuBar';
import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import TabPanel from 'components/TabPanel';
import { withRouter } from 'next/router';
import type { NextRouter } from 'next/router';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import type { GetServerSideProps } from 'next';
import TermAndPolicy from 'services/term_and_policy';
import type { TermAndPolicyRespond } from 'types/termAndPolicy';
import parse from 'html-react-parser';

interface TermOfServiceProps {
  router: NextRouter;
  term: TermAndPolicyRespond | null;
  policy: TermAndPolicyRespond | null;
}

const TermOfService = (props: TermOfServiceProps) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const { router, term, policy } = props;
  const { type } = router.query;
  const theme = useTheme();
  const mediaMinMd = useMediaQuery(theme.breakpoints.up('md'));
  const [breadcrumb, setBreadcrumb] = useState<string>('termOfService');

  useEffect(() => {
    if (type && typeof type === 'string' && type === '1') {
      setTab(1);
      setBreadcrumb('label.privatePolicy');
    } else {
      setTab(0);
      setBreadcrumb('label.buyTerm');
    }
  }, [type]);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
    if (tab === 1) {
      setBreadcrumb('label.buyTerm');
    } else {
      setBreadcrumb('label.privatePolicy');
    }
  };

  return (
    <HomeLayout>
      <Page title="Điều khoản dịch vụ">
        <Container
          sx={{
            mt: { xs: 14, sm: 20 },
            p: 2.25,
          }}
        >
          <Container>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <RouteLink
                href="/"
                sx={{ display: 'flex', alignItems: 'center' }}
                color={'primary.dark'}
              >
                <HomeIcon /> {t('label.home')}
              </RouteLink>
              <RouteLink
                href="/term-of-service"
                sx={{ display: 'flex', alignItems: 'center' }}
                color={'primary.dark'}
              >
                {t(breadcrumb)}
              </RouteLink>
            </Breadcrumbs>
          </Container>
          <Container
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              pl: 0,
              pr: 0,
              mt: 2,
            }}
          >
            {mediaMinMd && (
              <Container
                disableGutters
                maxWidth="s300"
                sx={{ order: { xs: 2, md: 1 } }}
              >
                <TermOfServiceMenuBar handleChange={handleChange} tab={tab} />
              </Container>
            )}

            <Container disableGutters sx={{ order: { xs: 1, md: 2 } }}>
              <Box sx={{ backgroundColor: 'background.paper' }}>
                <TabPanel index={0} value={tab}>
                  {term ? parse(term.content) : ''}
                </TabPanel>
                <TabPanel index={1} value={tab}>
                  {policy ? parse(policy.content) : ''}
                </TabPanel>
              </Box>
            </Container>
          </Container>
        </Container>
      </Page>
    </HomeLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const termRes = await TermAndPolicy.getTerm().catch(() => {
    return { data: null };
  });

  const policyRes = await TermAndPolicy.getPolicy().catch(() => {
    return { data: null };
  });

  return {
    props: {
      term: termRes.data,
      policy: policyRes.data,
    },
  };
};

export default withRouter(TermOfService);

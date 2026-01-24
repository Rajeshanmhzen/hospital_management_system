import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { useLocation, Link } from 'react-router-dom';
import { IconChevronRight } from '@tabler/icons-react';

const Breadcrum = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbItems = [
        <Text
            component={Link}
            to="/"
            key="home"
            c={pathnames.length === 0 ? "white" : "dimmed"}
            size="sm"
            style={{ textDecoration: 'none', fontWeight: 500 }}
        >
            Dashboard
        </Text>,
        ...pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

            return last ? (
                <Text key={to} size="sm" fw={500} c="white">
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Text>
            ) : (
                <Anchor
                    component={Link}
                    to={to}
                    key={to}
                    c="dimmed"
                    size="sm"
                    style={{ textDecoration: 'none', fontWeight: 500 }}
                >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Anchor>
            );
        }),
    ];

    return (
        <Breadcrumbs separator={<IconChevronRight size={14} color="gray" />}>
            {breadcrumbItems}
        </Breadcrumbs>
    );
};

export default Breadcrum;

import { Fragment } from 'react';

import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

function Footer() {
    const footerList = [
        {
            link: 'https://www.instagram.com/donategifts',
            text: 'Social Media',
            target: '_blank',
            addPipe: true,
        },
        {
            link: '/contact',
            text: 'Contact Us',
            addPipe: true,
        },
        {
            link: '/mission',
            text: 'Mission',
            addPipe: true,
        },
        {
            link: '/howto',
            text: 'How It Works',
            addPipe: true,
        },
        {
            link: '/team',
            text: 'Our Team',
            addPipe: true,
        },
        {
            link: '/wishcards',
            text: 'Wish Cards',
            addPipe: true,
        },
        {
            link: '/community',
            text: 'Community',
            addPipe: true,
        },
        {
            link: '/terms',
            text: 'Terms',
            addPipe: true,
        },
        {
            link: '/faq',
            text: 'FAQ',
            addPipe: false,
        },
    ];

    return (
        <MantineProviderWrapper>
            <div className="footer py-3">
                <div className="container">
                    <div className="d-flex justify-content-center py-3">
                        <div className="support text-warning">
                            <i className="fa fa-heart" />
                            <a
                                className="text-warning fs-5 px-2 text-decoration-none"
                                href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=LA5DA2K2C8HLW"
                                title="support our organization by paypal donation"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Support Our Cause
                            </a>
                            <i className="fa fa-heart" />
                        </div>
                    </div>

                    <div className="d-md-flex justify-content-center text-center">
                        {footerList.map((item, index) => (
                            <Fragment key={index}>
                                <a
                                    className="px-2 footer-item"
                                    href={item.link}
                                    target={item.target}
                                >
                                    {item.text}
                                </a>
                                {item.addPipe && <span className="text-white">|</span>}
                            </Fragment>
                        ))}
                    </div>
                    <div className="d-flex justify-content-center py-3">
                        <a className="px-2 text-center footer-item" href="/proof" target="_blank">
                            501(c)(3) non profit charitable organization
                        </a>
                    </div>
                    <div className="d-flex justify-content-center pb-2 text-white">
                        <p className="px-2 text-center">
                            Donate Gifts Inc. ©
                            {' '}
                            {new Date().getFullYear()}
                            {' '}
                            All rights reserved
                        </p>
                    </div>
                </div>
            </div>
        </MantineProviderWrapper>
    );
}

export default Footer;

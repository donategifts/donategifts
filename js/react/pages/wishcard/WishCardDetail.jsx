// import { Tabs } from '@mantine/core';

import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

export default function WishCardDetail() {
	// const header = `Hi, I am ${wishcard.childFirstName}!`;
	// const about = `About ${wishcard.childFirstName}`;
	// const imgList = [
	// 	'/img/gift-placeholder-1.jpg',
	// 	'/img/gift-placeholder-2.jpg',
	// 	'/img/gift-placeholder-3.jpg',
	// 	'/img/gift-placeholder-4.jpg',
	// 	'/img/gift-placeholder-5.jpg',
	// ];
	// const wishItemImg = imgList[Math.floor(Math.random() * 5)];
	// const wishItemPrice = `$${wishcard.wishItemPrice}`;
	// const agencyAddress = `${agency.agencyAddress.city + ', ' || ''}${
	// 	agency.agencyAddress.state + ', ' || ''
	// }${agency.agencyAddress.zipcode || ''}`;
	// const messageChildName = `Message ${wishcard.childFirstName}`;
	// const defaultText = `No one signed ${wishcard.childFirstName}'s card yet. Log in and send a message.`;
	// const options = { year: 'numeric', month: 'short', day: 'numeric' };

	return (
		<MantineProviderWrapper>
			{/* <div id='wishpage' className='py-4'>
        .container-fluid
            -

            .row.justify-content-center.align-items-start
                .col-md-4.col-lg-3.col-12.mt-4
                    .card-body.bg-white.shadow-lg.p-4.rounded-3.border.border-1.text-center.d-flex.flex-column.align-items-center
                        img.img-fluid.mt-2.rounded-3( src= wishcard.wishCardImage alt= wishcard.wishItemName loading='lazy' )
                        h1.cool-font.text-primary.my-3= header
                        if wishcard.status !== 'donated'
                            button#donate-btn.button-disabled.w-100( type='button' disabled='' aria-disabled='true' ) Gift Donated
                        else if user
                            a#donate-btn.button-accent.w-100( type='button' href='/wishcards/donate/' + wishcard._id ) Donate Gift
                        else
                            //- button#donate-btn.button-accent.w-100( type='button'
                            //-     data-bs-toggle='modal'
                            //-     data-bs-target='#loginModalCenter'
                            //- ) Donate Gift
                            a#donate-btn.button-accent.w-100( type='button' href='/login' ) Donate Gift

                .col-md-8.col-12.mt-4
                    .card-body.bg-white.p-4.mb-4.shadow-lg.rounded-3.border.border-1
                        .row.m-2
                            .col-lg-6.col-12
                                h2.my-4= about
                                p
                                    span.fw-bold My Age:
                                    span.mx-2= wishcard.age
                                p
                                    span.fw-bold My Interest:
                                    span.mx-2= wishcard.childInterest
                                p
                                    span.fw-bold My Story:
                                    span.mx-2= wishcard.childStory
                            .col-lg-6.col-12
                                h2.my-4 Care Agency
                                p
                                    i.fas.fa-building.text-secondary.me-2
                                    span= agency.agencyName
                                if agency.agencyAddress
                                    p
                                        i.fas.fa-map-marker-alt.text-secondary.me-2
                                        span= agencyAddress
                                if agency.agencyPhone
                                    p
                                        i.fas.fa-phone-alt.text-secondary.me-2
                                        = agency.agencyPhone
                                if agency.agencyWebsite
                                    p
                                        a.text-decoration-none.text-decoration( href= agency.agencyWebsite target='_blank' rel='noopener noreferrer' )
                                            i.fas.fa-link.text-secondary.me-2
                                            = agency.agencyWebsite
                                if agency.agencyBio
                                    p
                                        i.fas.fa-address-card.text-secondary.me-2
                                        span= agency.agencyBio

                    .card-body.bg-white.p-4.mb-4.shadow-lg.rounded-3.border.border-1
                        .row.m-2
                            .col-lg-6.col-12
                                h2.my-4 My Wish
                                .wish-box
                                    img.img-fluid.mb-3.rounded-3( src= wishItemImg  alt= wishcard.wishItemName loading='lazy' )
                                p
                                    span.fw-bold Item Name:
                                    span.mx-2= wishcard.wishItemName
                                p
                                    span.fw-bold Item Price:
                                    span.mx-2= wishItemPrice
                            .col-lg-6.col-12
                                if user
                                    h2.my-4 Send Message
                                    form.text-center.d-flex.flex-column.justify-content-center( action='/wishcards/message' method='post' )
                                        .wish-box
                                            select.custom-select( aria-label=".form-select-lg example" )
                                                option( selected ) Select a message to send
                                                each message, index in defaultMessages
                                                    option( value=index )= message
                                            textarea#custom-message-textbox.mt-3.p-3( rows= "7" placeholder="or write your custom message..." )
                                        button#submit-message.btn.btn-lg.button-primary.mt-4.d-flex.justify-content-center( type='submit' )= messageChildName

                    .card-body.bg-white.p-4.mb-4.shadow-lg.rounded-3.border.border-1
                        .row.m-2
                            h2.my-4 Message Board
                            if messages.length === 0
                                p= defaultText
                            else
                                each message in messages
                                    .msg-each.row.px-3.py-4
                                        .col-12
                                            - var createdAt = message.createdAt.toLocaleDateString('en-us', options);
                                            if message.messageFrom && message.messageFrom.fName && message.messageFrom.lName
                                                - var posterName = `${message.messageFrom.fName} ${message.messageFrom.lName.charAt(0)}.`
                                                .fw-bold= posterName
                                                p.mt-0= createdAt
                                                p.d-flex.align-items-center
                                                    i.far.fa-comment-dots.text-secondary.me-2.fs-4
                                                    span= message.message */}
		</MantineProviderWrapper>
	);
}

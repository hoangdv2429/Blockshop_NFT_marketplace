// import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import Link from 'next/link'

const endpoint = "https://ceramic-clay.3boxlabs.com"

function MyApp({ Component, pageProps }) {

    return (
        <body>
            <header>
                <div>
                    <nav className="header--">
                        <p className="logo">NFT Blockshop</p>
                        <div id='head' className="flex mt-4">
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                            <Link href="/create-item">
                                <a>Sell Digital Asset</a>
                            </Link>
                            <Link href="/my-assets">
                                <a>My Digital Assets</a>
                            </Link>
                            <Link href="/creator-dashboard">
                                <a>Creator Dashboard</a>
                            </Link>
                            <Link href="/profile">
                                <a>Profile</a>
                            </Link>
                        </div>
                    </nav>
                    <Component {...pageProps} />
                </div>
            </header>
            <footer>

                <div class="foot-content">
                    <div class="ft-bg-overlay"></div>
                    <div class="wrapper">
                        <div class="footer-grid">
                            <div class="footer-grid-item">
                                <ul>
                                    <h3>NFT Blockshop</h3>
                                    <li>
                                        <a href="">© 2021 NFT Blockshop</a>
                                    </li>

                                </ul>
                            </div>
                            <div class="footer-grid-item">
                                <ul class="footer-contact no-bullets">
                                    <h3>FOR ARTISTS</h3>
                                    <li>
                                        <a href="profile">Your Profile</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="footer-grid-item">
                                <div class="footer-subscribe">
                                    <h3>Subscribe</h3>

                                    <form
                                        accept-charset="UTF-8"
                                        action=""
                                        class="contact-form"
                                        method="post"
                                    >
                                        <div class="input-group subscribe-form">
                                            <input id="mail-" type="email" placeholder="Email address" />
                                            <button type="submit">
                                                <i class="fa fa-paper-plane"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div class="footer-grid-item">
                                <ul class="footer-social">
                                    <h3>COMMUNITY</h3>
                                    <div class="ft-social-network">
                                        <a href="https://www.facebook.com/superrare.co"><img src='../icon-facebook.png'></img></a>

                                        <a href="https://www.instagram.com/superrare.co/"><img src='../icon-instagram.png'></img></a>

                                        <a href="https://www.youtube.com/channel/UCp9loE7UzFpFxtQHNK8TbKg" ><img src='../icon-youtube.png'></img></a>
                                    </div>
                                </ul>
                            </div>
                            <div class="footer-grid-item">
                                <ul class="footer-certification no-bullets">
                                    <h3>LEGAL</h3>

                                    <li>
                                        <a href="CommunityPage">Community Guidelines</a>
                                    </li>
                                    <li>
                                        <a href="ServicePage">Terms of Service</a>
                                    </li>
                                    <li>
                                        <a href="PrivacyPage">Privacy Policy</a>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </body>
    )
}

export default MyApp
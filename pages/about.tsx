import type { NextPage } from 'next';

const About : NextPage = (props) => {
    const questionStyle = "text-3xl ml-40 mt-5 font-medium";
    const answerStyle = "text-xl ml-44 mr-44 mt-3 mb-5";
    return (
    <div>
        <div className="bg-exeter py-16 px-8 lg:px-40">
            <h1 className="font-display text-4xl font-black text-white md:text-5xl ">
            About
            </h1>
        </div>
            <p className="text-3xl ml-40 mt-8 font-medium">
                What&rsquo;s the point of this website?
            </p>
            <p className={answerStyle}>
                The Exeter Course Map is meant to help PEA students choose their courses. While the Course Catalog is good as a reference book, it&rsquo;s very long and dense, so many students don&rsquo;t fully read it. Tree-styled graphs are optimal for quickly representing the prerequisite relationships between different courses.
            </p>
            <p className={questionStyle}>
                How can I get all the requirements for a course?
            </p>
            <p className={answerStyle}>
                First find your course in the &quot;Courses&quot; page. Then, click the &quot;More Requirements&quot; button until the tree stops growing. This will show you every level of prereqs/coreqs required to take the course.
            </p>
            <p className={questionStyle}>
                How can I see all the classes I can take in a subject?
            </p>
            <p className={answerStyle}>
                Different subjects/groups of subjects are displayed in submaps, which you can find in the &quot;Maps&quot; page. These submaps list all the courses in a subject and their prereqs/coreqs.
            </p>
            <p className={questionStyle}>
                How do I navigate the maps?
            </p>
            <p className={answerStyle}>
                You can pan around the map by scrolling on trackpad or clicking and dragging, and you can zoom in/out by pinching on trackpad or scrolling with your scroll wheel.
            </p>
            <p className={questionStyle}>
                How do I keep the course information popup on screen?
            </p>
            <p className={answerStyle}>
                Right-click (or control-click if on Mac) on a course to pin its information popup on the screen. Left-click anywhere else on the map to unpin this popup.
            </p>
            <p className={questionStyle}>
                What if I have a suggestion or I&rsquo;ve encountered a bug/mistake?
            </p>
            <p className={answerStyle}>
                Please send it our way! Either shoot us an email or use the &quot;Send Feedback&quot; button in the footer.
            </p>
            <p className={questionStyle}>
                What features will be added in the future?
            </p>
            <p className={answerStyle}>
                We first plan on implementing a database where you can input the classes you&rsquo;ve completed. Then we can show you your progress towards diploma requirements and grey out the courses you can&rsquo;t take. We also want to implement a &quot;friend&quot; system where you can see the courses your friends are planning to take.
            </p>
            <p className={questionStyle}>
                Who made this website?
            </p>
            <p className={answerStyle}>
                The Exeter Course Map was designed and built by Michael Chen, Byran Huang, Nathan Khuu, and Eric Li from the Exeter Computing Club Project Group. We also want to thank Avaninder Bhaghayath for helping us fix our database.
            </p>
            <p className={questionStyle}>
                I&rsquo;m a PEA student interesting in contributing to the Course Map. Who do I contact?
            </p>
            <p className="text-xl ml-44 mr-44 mt-3 mb-8">
                <span>Reach out to either Michael Chen </span>
                <a 
                    href="mailto: mqchen@exeter.edu"
                    className="underline text-blue-600 "
                >
                   (mqchen@exeter.edu)
                </a>
                <span> or Nathan Khuu </span>
                <a 
                    href="mailto: nkhuu@exeter.edu"
                    className="underline text-blue-600 "
                >
                    (nkhuu@exeter.edu)
                </a>
                <span>. We&rsquo;re open to beginners, so don&rsquo;t be shy! Our only requirements are that you care about the project and can learn new things.</span>
            </p>
            
    </div>
    );
};

export default About;
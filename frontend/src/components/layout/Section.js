const Section = (sectionid, component) => {
    const section = document.createElement('section');
    section.id = sectionid;
    section.className = 'section';
    section.appendChild(component);
    return section;
};

export default Section;
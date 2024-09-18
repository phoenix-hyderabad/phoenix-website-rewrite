import professors from "@/lib/professor_data";
import ProfessorCard from "@/components/aboutus_page/ProfessorCard";

const ProfsTabContent = () => {
  return (
    <>
      <h2 className="py-4 text-center text-3xl">Professors</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(19rem,max-content))] justify-center gap-4">
        {professors.map((e, index) => (
          <ProfessorCard
            key={index}
            name={e.faculty}
            designation={e.Designation}
            img={`/professorImages/${e.faculty}.png`}
          />
        ))}
      </div>
    </>
  );
};

export default ProfsTabContent;

const bandMembers = [
  {
    name: "СНІШКА",
    slug: "snishka",
    imageUrl: "/images/members/snishka.png",
    role: "Вокалистка, авторка текстів",
    bio: "СНІШКА - це ведуча вокалістка, яка відома своєю потужною сценічною присутністю та зворушливими текстами, що визначають звучання гурту."
  },
  {
    name: "МИХАЙЛО",
    slug: "michael",
    imageUrl: "/images/members/misha.png",
    role: "Композитор",
    bio: "МИХАЙЛО створює складні мелодії та ритми, які надають гурту його унікального звучання. Його впливи варіюються від класичного року/металу до сучасного інді."
  },
  {
    name: "АЛІНА",
    slug: "alina",
    imageUrl: "/images/members/alina.png",
    role: "Барабани",
    bio: "АЛІНА - це потужна сила за ударною установкою, яка рухає гурт вперед своїм динамічним і точним грою. Вона приносить незаперечну енергію в кожному виступі."
  },
  {
    name: "МАРІ",
    slug: "mary",
    imageUrl: "/images/members/mary.png",
    role: "Бас-гітара",
    bio: "МАРІ - майстер бас-гітари, який забезпечує міцну основу для музики гурту. Її глибокі басові лінії додають текстуру і глибину кожній пісні."
  },
];

export default function MemberPage({ params }: { params: { memberName: string } }) {
  // Find the correct member based on the 'slug' from the URL.
  const member = bandMembers.find(m => m.slug === params.memberName);

  // If no member is found, you can show a "not found" message.
  if (!member) {
    return <div className="pt-24 text-center">Member not found.</div>;
  }

  return (
    <div className="pt-16"> {/* Padding to account for the fixed header */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Member Image */}
          <div className="w-full aspect-square">
            <img 
              src={member.imageUrl} 
              alt={`Photo of ${member.name}`}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
          </div>
          {/* Member Info */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-wider">{member.name}</h1>
            <p className="text-xl text-gray-400 mt-2 mb-6">{member.role}</p>
            <p className="text-lg text-gray-300 leading-relaxed">{member.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}